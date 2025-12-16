import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FilePath_PlotPoints = path.join(__dirname, "data/plotpoints.json");
const FilePath_Quests = path.join(__dirname, "data/quests.json");
const FilePath_GameState = path.join(__dirname, "data/gamestate.json");
const FilePath_History = path.join(__dirname, "data/history.json");

const Api_Base = "/api/";
const Api_PlotPoints = Api_Base + "plotpoints";
const Api_Quests = Api_Base + "quests";
const Api_GameState = Api_Base + "gamestate";
const Api_History = Api_Base + "history";

export const Ollama_Host_URL = process.env.OLLAMA_URL || "http://localhost:11434";
export const FilePaths = {
    FilePath_PlotPoints,
    FilePath_Quests,
    FilePath_GameState,
    FilePath_History
}
export const ApiPaths = {
    Api_PlotPoints,
    Api_Quests,
    Api_GameState,
    Api_History
}