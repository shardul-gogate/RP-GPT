// package.json should have "type": "module" if you want to use import syntax,
// otherwise convert to require() style below.
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const OLLAMA_BASE = process.env.OLLAMA_URL || "http://localhost:11434";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORY_FILE = path.join(__dirname, "data/storycards.json");
const QUESTS_FILE = path.join(__dirname, "data/quests.json");
const GAMESTATE_FILE = path.join(__dirname, "data/gamestate.json");
const HISTORY_FILE = path.join(__dirname, "data/history.json");

app.post("/api/chat", async (req, res) => {
  const { prompt, model } = req.body;

  try {
    const payload = {
      model,
      prompt,
      stream: false
    };

    const r = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(502).json({ error: "Ollama error", details: errText });
    }

    const data = await r.json();
    return res.json({ ok: true, message: data.response });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/storycards", (req, res) => {
  fs.readFile(STORY_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading storyCards.json:", err);
      return res.status(500).json({ error: "Failed to read story cards" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/storycards", (req, res) => {
  const updatedCards = req.body; // expect an array of story cards
  fs.writeFile(STORY_FILE, JSON.stringify(updatedCards, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing storyCards.json:", err);
      return res.status(500).json({ error: "Failed to save story cards" });
    }
    res.json({ success: true });
  });
});

app.get("/api/quests", (req, res) => {
  fs.readFile(QUESTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading quests.json:", err);
      return res.status(500).json({ error: "Failed to read quests" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/quests", (req, res) => {
  const updatedQuests = req.body; // expect array of quest objects
  fs.writeFile(QUESTS_FILE, JSON.stringify(updatedQuests, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing quests.json:", err);
      return res.status(500).json({ error: "Failed to save quests" });
    }
    res.json({ success: true });
  });
});

app.get("/api/gamestate", (req, res) => {
  fs.readFile(GAMESTATE_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading gamestate.json:", err);
      return res.status(500).json({ error: "Failed to read game state" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/gamestate", (req, res) => {
  const updatedGameState = req.body; // expect game state object
  fs.writeFile(GAMESTATE_FILE, JSON.stringify(updatedGameState, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing gamestate.json:", err);
      return res.status(500).json({ error: "Failed to save game state" });
    }
    res.json({ success: true });
  });
});

app.get("/api/history", (req, res) => {
  fs.readFile(HISTORY_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading history.json:", err);
      return res.status(500).json({ error: "Failed to read history" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/history", (req, res) => {
  const updatedHistory = req.body; // expect array of message objects
  fs.writeFile(HISTORY_FILE, JSON.stringify(updatedHistory, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing history.json:", err);
      return res.status(500).json({ error: "Failed to save history" });
    }
    res.json({ success: true });
  });
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
