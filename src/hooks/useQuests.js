import { useState, useEffect } from "react";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function useQuests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    api.get(ApiPaths.Api_Quests)
      .then((data) => setQuests(data));
  }, []);

  const addNewQuest = () => {
    setQuests(prev => [
      ...prev,
      { name: "", status: "Inactive", objectives: [] }
    ]);
  };

  const updateQuest = (index, updatedQuest) => {
    const newQuests = [...quests];
    newQuests[index] = updatedQuest;
    setQuests(newQuests);

    api.post(ApiPaths.Api_Quests, newQuests);
  };

  return { quests, addNewQuest, updateQuest };
}