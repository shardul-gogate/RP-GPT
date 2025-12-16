import { readFile, writeFile } from "../utils/fileHelpers.js";
import { FilePaths, ApiPaths } from "../utils/constants.js";

export default function register(app) {
    app.get(ApiPaths.Api_GameState, async (req, res) => {
        try {
            const data = await readFile(FilePaths.FilePath_GameState);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post(ApiPaths.Api_GameState, async (req, res) => {
        try {
            await writeFile(FilePaths.FilePath_GameState, req.body);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
