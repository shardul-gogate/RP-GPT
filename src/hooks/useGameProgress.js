import { useState, useEffect } from "react";
import { buildAIPrompt } from "../utils/buildPrompt";
import { ApiPaths } from "../utils/constants";
import api from "../utils/api";

export function useGameProgress(quests, plotPoints, gameState) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("MistralRP");

  useEffect(() => {
    api.get(ApiPaths.Api_Progress)
      .then((data) => setMessages(data));
  }, []);

  async function generate(currentMessages) {
    setLoading(true);
    try {
      const data = await api.post("/api/chat", {
        prompt: buildAIPrompt(currentMessages, quests, plotPoints, gameState),
        model: model,
      });
      setMessages(m => [...m, data || "No response"]);
    } catch (e) {
      setMessages(m => [...m, "Error: " + e.message]);
    } finally {
      setLoading(false);
    }
  }

  const saveHistory = () => {
    api.post(ApiPaths.Api_Progress, messages);
  };

  const eraseLastMessage = () => setMessages(m => m.slice(0, -1));

  const retry = () => {
    eraseLastMessage();
    generate(messages.slice(0, -1));
  };

  const continueChat = () => generate(messages);

  const send = (prompt) => setMessages(m => [...m, prompt]);

  return { messages, setMessages, loading, model, setModel, saveHistory, eraseLastMessage, retry, continueChat, send };
}