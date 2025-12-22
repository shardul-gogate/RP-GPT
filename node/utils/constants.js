import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FilePath_PlotPoints = path.join(__dirname, "../data/plotpoints.json");
const FilePath_Quests = path.join(__dirname, "../data/quests.json");
const FilePath_GameState = path.join(__dirname, "../data/gamestate.json");
const FilePath_Progress = path.join(__dirname, "../data/progress.json");

const Api_Base = "/api/";
const Api_PlotPoints = Api_Base + "plotpoints";
const Api_Quests = Api_Base + "quests";
const Api_GameState = Api_Base + "gamestate";
const Api_Progress = Api_Base + "progress";
const Api_FullSave = Api_Base + "fullsave";
const Api_LoadGame = Api_Base + "loadgame";

export const Ollama_Host_URL = process.env.OLLAMA_URL || "http://localhost:11434";
export const FilePaths = {
    FilePath_PlotPoints,
    FilePath_Quests,
    FilePath_GameState,
    FilePath_Progress
}
export const ApiPaths = {
    Api_PlotPoints,
    Api_Quests,
    Api_GameState,
    Api_Progress,
    Api_FullSave,
    Api_LoadGame
}