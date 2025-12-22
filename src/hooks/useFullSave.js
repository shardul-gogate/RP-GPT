import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function useFullSave() {
  const saveFullGame = (gameName) => {
    api.post(ApiPaths.Api_FullSave, { gameName });
  };

  const loadGame = (gameName) => {
    api.post(ApiPaths.Api_LoadGame, { gameName });
  };

  return { saveFullGame, loadGame };
}
