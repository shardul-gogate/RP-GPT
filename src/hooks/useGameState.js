import { useState, useEffect } from "react";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function useGameState() {
  const [gameState, setGameState] = useState({ date: "Unknown", day: "Unknown Day", timeOfDay: "Unknown Time" });

  useEffect(() => {
    api.get(ApiPaths.Api_GameState)
      .then((data) => {
        setGameState({
          date: data.date || "Unknown Date",
          day: data.day || "Unknown Day",
          timeOfDay: data.timeOfDay || "Unknown Time",
        });
      });
  }, []);

  const updateGameState = (newState) => {
    setGameState(newState);
    api.post(ApiPaths.Api_GameState, newState);
  };

  return { gameState, updateGameState };
}