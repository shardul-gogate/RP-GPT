import { useState, useEffect } from "react";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function useGameState() {
  const [gameState, setGameState] = useState({ dayAndDate: "Unknown Day and Date", timeOfDay: "Unknown Time" });

  useEffect(() => {
    api.get(ApiPaths.Api_GameState)
      .then((data) => {
        setGameState({
          dayAndDate: data.dayAndDate,
          timeOfDay: data.timeOfDay,
        });
      })
      .catch(() => {});
  }, []);

  const updateGameState = (newState) => {
    setGameState(newState);
    api.post(ApiPaths.Api_GameState, newState).catch(() => {});
  };

  return { gameState, updateGameState };
}