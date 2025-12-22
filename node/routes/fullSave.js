import path from "path";
import { ApiPaths } from "../utils/constants.js";
import { makeDirectory, copyFile, getGameFilesToCopy } from "../utils/fileHelpers.js";
import { validGameName } from "../utils/validator.js";

export default function register(app) {
    app.post(ApiPaths.Api_FullSave, async (req, res) => {
        const { gameName } = req.body;
        console.log("this is game name", gameName)

        if (!validGameName(gameName)) {
            return res.status(400).json({ ok: false, message: "Invalid save name." });
        }

        const dataDir = path.resolve(process.cwd(), 'data');
        const savedGamesDir = path.join(dataDir, "saved_games");
        const newSaveDir = path.join(savedGamesDir, gameName);

        try {
            await makeDirectory(newSaveDir);

            const filesToCopy = getGameFilesToCopy();

            for (const file of filesToCopy) {
                const sourcePath = path.join(dataDir, file);
                const destPath = path.join(newSaveDir, file);
                await copyFile(sourcePath, destPath);
            }

            res.json({ ok: true, message: `Game saved successfully as '${gameName}'.` });
        } catch (err) {
            console.error(`Error during full save for '${gameName}':`, err);
            res.status(500).json({ ok: false, message: "Failed to save game." });
        }
    });

    app.post(ApiPaths.Api_LoadGame, async (req, res) => {
        const { gameName } = req.body;
        console.log(gameName)

        if (!validGameName(gameName)) {
            return res.status(400).json({ ok: false, message: "Invalid save name." });
        }

        const dataDir = path.resolve(process.cwd(), 'data');
        const savedGamesDir = path.join(dataDir, "saved_games");
        const loadDir = path.join(savedGamesDir, gameName);

        try {
            const filesToCopy = getGameFilesToCopy();

            for (const file of filesToCopy) {
                const sourcePath = path.join(loadDir, file);
                const destPath = path.join(dataDir, file);
                await copyFile(sourcePath, destPath);
            }

            res.json({ ok: true, message: `Game loaded successfully from '${gameName}'.` });
        } catch (err) {
            console.error(`Error during load for '${gameName}':`, err);
            res.status(500).json({ ok: false, message: "Failed to load game." });
        }
    });
}