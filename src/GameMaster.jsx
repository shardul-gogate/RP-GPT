import { useState, useEffect } from "react";
import UserInput from "./components/UserInput";
import ActionButton from "./components/ActionButton";
import Canvas from "./components/Canvas";
import StoryCard from "./components/StoryCard";
import Quest from "./components/Quest";
import GameState from "./components/GameState";
import ModelSelector from "./components/ModelSelector";

export default function GameMaster() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storyCards, setStoryCards] = useState([]);
  const [quests, setQuests] = useState([]);
  const [gameState, setGameState] = useState({ date: "Unknown", day: "Unknown Day", timeOfDay: "Unknown Time" });
  const [model, setModel] = useState("MistralRP");

  useEffect(() => {
    fetch("/api/storycards")
      .then((res) => res.json())
      .then((data) => setStoryCards(data))
      .catch((err) => console.error("Error loading story cards:", err));
  }, []);

  useEffect(() => {
    fetch("/api/quests")
      .then((res) => res.json())
      .then((data) => setQuests(data))
      .catch((err) => console.error("Error loading quests:", err));
  }, []);

  useEffect(() => {
    fetch("/api/gamestate")
      .then((res) => res.json())
      .then((data) => {
        setGameState({
          date: data.date || "Unknown Date",
          day: data.day || "Unknown Day",
          timeOfDay: data.timeOfDay || "Unknown Time",
        })
      })
      .catch((err) => console.error("Error loading game state:", err));
  }, []);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error loading history:", err));
  }, []);


  const addNewStoryCard = () => {
    setStoryCards(prev => [
      ...prev,
      { description: "", triggers: [] }
    ]);
  };

  const addNewQuest = () => {
    setQuests(prev => [
      ...prev,
      { name: "", status: "Inactive", objectives: [] }
    ]);
  };

  const handleUpdateCard = (index, updatedCard) => {
    setStoryCards(prev => {
      const newCards = [...prev];
      newCards[index] = updatedCard;

      fetch("/api/storycards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCards),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) console.error("Failed to save story cards");
        })
        .catch(err => console.error("Error saving story cards:", err));

      return newCards;
    });
  };

  const handleUpdateQuest = (index, updatedQuest) => {
    setQuests(prev => {
      const newQuests = [...prev];
      newQuests[index] = updatedQuest;

      // Send to backend
      fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuests),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) console.error("Failed to save quests");
        })
        .catch(err => console.error("Error saving quests:", err));

      return newQuests;
    });
  };

  const handleUpdateGameState = (newState) => {
    setGameState(newState);
    fetch("/api/gamestate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newState),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) console.error("Failed to save game state");
      })
      .catch(err => console.error("Error saving game state:", err));
  }

  async function sendPrompt() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;
    const newMessages = [...messages, trimmedPrompt];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);
    await generate(newMessages);
  }

  function eraseLastMessage() {
    if (messages.length === 0) return;
    setMessages(messages.slice(0, -1));
  }

  async function retryPrompt() {
    if (messages.length === 0) return;
    const newMessages = messages.slice(0, -1); // remove last message
    setMessages(newMessages);
    setLoading(true);
    await generate(newMessages);
  }

  async function continueChat() {
    if (messages.length === 0) return;
    setLoading(true);
    await generate(messages);
  }

  async function generate(newMessages) {
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: buildAIPrompt(newMessages, quests, storyCards, gameState),
          model: model,
        }),
      });
      const data = await resp.json();

      if (data?.message) {
        setMessages(m => [...m, data.message]);
      } else {
        setMessages(m => [...m, "No response"]);
      }
    } catch (e) {
      setMessages(m => [...m, "Error: " + e.message]);
    } finally {
      setLoading(false);
    }
  }

  async function saveHistory() {
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) console.error("Failed to save history");
      })
      .catch(err => console.error("Error saving history:", err));
  }

  function buildAIPrompt(messages, quests, storyCards, gameState) {
    const contextMessages = messages
      .slice(-15, -1) // take last 20 messages excluding the latest input
      .map(message => message.trim())
      .join(" ");

    const latestInput = messages
      .slice(-1)[0]
      .trim();

    // Include all quests
    const questText = quests
      .filter(quest => quest.status === "Active")
      .map(quest => {
        const objectives = quest.objectives
          .map(objective => `${objective.name} - [${objective.completed ? "done" : "pending"}]`)
          .join(", ");
        return `Quest: ${quest.name} (Status: ${quest.status}) - Description: ${quest.description} - Objectives: ${objectives}`;
      })
      .join("\n");

    // Scan for triggered StoryCards
    const textToScan = contextMessages + "\n" + latestInput + "\n" + questText;
    const triggeredCards = storyCards.filter(card =>
      card.triggers.some(trigger => {
        const pattern = new RegExp(`\\b${trigger}\\b`, "i"); // word boundary, case-insensitive
        return pattern.test(textToScan);
      })
    );
    console.log("# of Triggered Story Cards:", triggeredCards.length);
    const storyCardText = triggeredCards.map(card => `- ${card.description}`).join("\n");

    // Build final prompt
    const prompt = `
    Story Context:
    ${contextMessages}

    Active Quests:
    ${questText || "None"}

    Relevant Plot Elements:
    ${storyCardText || "None"}

    In-game Date and Time:
    ${gameState.date || "<unknown>"}, ${gameState.day || "<unknown>"}, ${gameState.timeOfDay || "<unknown>"}

    Player Input:
    ${latestInput}
    `;
    console.log("Prompt : ", prompt)
    return prompt;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left: Canvas + Input */}
      <div style={{ flex: 5, display: "flex", flexDirection: "column", padding: 12, gap: 8 }}>
        <Canvas
          messages={messages}
          onEditMessage={(idx, newValue) => {
            setMessages((prev) =>
              prev.map((m, i) => (i === idx ? newValue : m))
            );
          }}
        />

        {/* Input + Button + Gamestate row */}
        <div style={{ display: "flex", gap: 8, flex: 2 }}>
          <UserInput
            value={prompt}
            onChange={setPrompt}
            placeholder="Describe your action or dialogue"
          />
          {/* Column for Buttons and GameState */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <ActionButton
                label={loading ? "..." : "Send"}
                onClick={sendPrompt}
                disabled={loading}
              />
              <ActionButton
                label={loading ? "..." : "Erase"}
                onClick={eraseLastMessage}
                disabled={loading}
              />
              <ActionButton
                label={loading ? "..." : "Retry"}
                onClick={retryPrompt}
                disabled={loading}
              />
              <ActionButton
                label={loading ? "..." : "Continue"}
                onClick={continueChat}
                disabled={loading}
              />
              <ActionButton
                label="Save"
                onClick={saveHistory}
              />
            </div>
            <GameState
              gameState={gameState}
              onChange={(newState) => handleUpdateGameState(newState)}
            />
            <ModelSelector
              model={model}
              onChange={(newModel) => setModel(newModel)}
            />
          </div>
        </div>
      </div>

      {/* Right: StoryCards + Quests */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderLeft: "1px solid #ddd", padding: 8, gap: 8 }}>
        
        {/* StoryCards panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderBottom: "1px solid #ddd", overflow: "auto" }}>
          <button onClick={addNewStoryCard}>+ New Story Card</button>
          {storyCards.map((card, idx) => (
            <StoryCard
              key={idx}
              description={card.description}
              triggers={card.triggers}
              onUpdate={(updatedCard) => handleUpdateCard(idx, updatedCard)}
            />
          ))}
        </div>

        {/* Quests panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          <button onClick={addNewQuest}>+ New Quest</button>
          {quests.map((quest, idx) => (
            <Quest
              key={idx}
              name={quest.name}
              description={quest.description}
              status={quest.status}
              objectives={quest.objectives}
              onUpdate={(updatedQuest) => handleUpdateQuest(idx, updatedQuest)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}