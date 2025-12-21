// package.json should have "type": "module" if you want to use import syntax,
// otherwise convert to require() style below.
import express from "express";
import cors from "cors";
import registerChat from "./routes/chat.js";
import registerPlotPoints from "./routes/plotPoints.js";
import registerQuests from "./routes/quests.js";
import registerGameState from "./routes/gameState.js";
import registerProgress from "./routes/progress.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Register route handlers (each route's handlers live in their own file)
registerChat(app);
registerPlotPoints(app);
registerQuests(app);
registerGameState(app);
registerProgress(app);


app.listen(3001, () => console.log("Node server listening on port http://localhost:3001"));
