import { useState, useEffect } from "react";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";
import { QuestStatusEnum } from "../utils/enums";

export function useQuests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    api.get(ApiPaths.Api_Quests)
      .then((data) => setQuests(data));
  }, []);

  const addNewQuest = (index) => {
    setQuests(prev => {
      const newQuests = [...prev];
      newQuests.splice(index, 0, { name: "", status: QuestStatusEnum.ACTIVE, description: "", objectives: [], sample: false });
      return newQuests;
    });
  };

  const updateQuest = (index, updatedQuest) => {
    const newQuests = [...quests];
    newQuests[index] = updatedQuest;
    setQuests(newQuests);
    api.post(ApiPaths.Api_Quests, newQuests);
  };

  const deleteQuest = (index) => {
    const currentQuests = [...quests];
    currentQuests.splice(index, 1);
    setQuests(currentQuests);
    api.post(ApiPaths.Api_Quests, currentQuests);
  };

  return { quests, addNewQuest, updateQuest, deleteQuest };
}