import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function useGameProgress() {
  const saveHistory = (messages) => {
    api.post(ApiPaths.Api_Progress, messages).catch(() => {});
  };

  return { saveHistory };
}