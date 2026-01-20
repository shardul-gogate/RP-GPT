const Api_Base = "/api/";
const Api_PlotPoints = Api_Base + "plotpoints";
const Api_Quests = Api_Base + "quests";
const Api_GameState = Api_Base + "gamestate";
const Api_Progress = Api_Base + "progress";
const Api_FullSave = Api_Base + "fullsave";
const Api_LoadGame = Api_Base + "loadgame";
const Api_Ollama_Models = Api_Base + "ollama/models";
const Api_Ollama_Generate_Stream = "http://localhost:3001/api/ollama/generate-stream";
const Api_Settings = Api_Base + "settings";
const Api_Summary = Api_Base + "summary";
const Api_Generate_Summary = Api_Summary + "/generate";

export const ApiPaths = {
    Api_PlotPoints,
    Api_Quests,
    Api_GameState,
    Api_Progress,
    Api_FullSave,
    Api_LoadGame,
    Api_Ollama_Models,
    Api_Ollama_Generate_Stream,
    Api_Settings,
    Api_Summary,
    Api_Generate_Summary
}