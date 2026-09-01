# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

RP-GPT is a browser-based AI text-adventure game master. A React frontend talks to a small Express backend, which proxies prompts to a locally-running (or remote) [Ollama](https://ollama.com/) instance and persists all game data as flat JSON files on disk. There is no database.

## Commands

Two separate npm projects must run together — a React dev server (root) and an Express API server (`node/`).

```bash
# Install dependencies (run once, in both locations)
npm install
cd node && npm install && cd ..

# Run both servers at once
./exec/run.sh      # macOS/Linux
exec\run.bat       # Windows

# Or run them separately:
npm start          # root: React dev server on :3000 (proxies /api to :3001)
cd node && npm start   # node/: Express server on :3001
```

- Frontend tests: `npm test` (Create React App / Jest, via `react-scripts test`). There is no test suite for the `node/` backend (`npm test` there is a stub that exits with an error).
- Frontend build: `npm run build`.
- No lint command is wired up beyond the CRA-embedded `eslintConfig` (`react-app`, `react-app/jest`) in the root [package.json](package.json).
- Ollama must be running separately (`ollama pull mistral-nemo` or similar) for anything that calls the AI to work. `OLLAMA_URL` env var overrides the default `http://localhost:11434` used by the backend (see [node/utils/constants.js](node/utils/constants.js)).

## Architecture

### Two servers, one proxy

- **Root** (`src/`): React 19 app (Create React App). `package.json` sets `"proxy": "http://localhost:3001"` so relative `/api/...` calls from the frontend reach the Express backend during `npm start`.
- **`node/`** (`node/server.js`): Express app registering one router module per resource from `node/routes/*.js`. Each route file is self-contained (reads/writes one JSON file, or proxies to Ollama) and registered in `server.js` via a `registerX(app)` function.
- Frontend API paths live in [src/utils/constants.js](src/utils/constants.js); backend paths/file locations live in [node/utils/constants.js](node/utils/constants.js). These two files must be kept in sync manually — there's no shared source of truth. Note `Api_Ollama_Generate_Stream` on the frontend is a full absolute URL (bypasses the CRA proxy, since it's a streamed response), while every other frontend API path is relative.

### Persistence model: flat JSON files, no DB

All game data lives in `node/data/*.json` (plot points, quests, game state, message progress, Ollama settings, summary — see `FilePaths` in [node/utils/constants.js](node/utils/constants.js)). Every resource route (`plotPoints.js`, `quests.js`, `gameState.js`, `progress.js`, `settings.js`, `summary.js`) follows the same shape: `GET` reads the whole file via [readFile](node/utils/fileHelpers.js), `POST` overwrites it wholesale via `writeFile`. There is no partial-update/patch semantics anywhere — the frontend always sends the full array/object it wants persisted.

"Full save" / "load" ([node/routes/fullSave.js](node/routes/fullSave.js)) copies that entire set of JSON files into/out of `node/data/saved_games/<name>/`. Save/load names are validated by [validGameName](node/utils/validator.js) to block path traversal (`..`, `/`, `\\`) since the name becomes a directory name.

### Frontend state: one hook per backend resource

`src/hooks/` mirrors the backend resources 1:1 (`usePlotPoints`, `useQuests`, `useGameState`, `useGameProgress`, `useSettings`, `useSummary`, `useFullSave`, `useOllama`). Each hook owns fetching its resource on mount and exposing save/update/delete functions that call `src/utils/api.js`. [GameMaster.jsx](src/GameMaster.jsx) is the top-level component that wires all these hooks together and owns the live `messages` array (the actual story transcript) in local state — messages are only persisted on demand (`saveHistory`/quick-save, or full save), not automatically.

`src/utils/api.js` is the single fetch wrapper: `handleResponse` expects the backend's `{ ok, message, data }` envelope, shows a toast on `message`/error via `react-hot-toast`, and unwraps to `data`. `postStream` is separate — it reads the raw streamed response body chunk-by-chunk (used only for Ollama generation) instead of parsing one JSON envelope.

### Prompt construction ([src/utils/prompt.js](src/utils/prompt.js))

This is the core "game master" logic, entirely on the frontend:
- `buildGamePrompt` assembles what gets sent to Ollama: an optional running `summary` (chapters), a word-budgeted window of recent `messages` (`getContextMessages`, capped in words not messages/tokens), active quests text, "triggered" plot points, and current `gameState` (day/time).
- Plot points are surfaced to the model via **trigger matching**, not always-on injection: `getTriggeredPlotPoints` scans the context+latest input+quest text for each plot point's trigger words and only includes a plot point if it matches strongly enough (either one trigger word appearing ≥2 times, or ≥2 distinct triggers matching at least once). This keeps prompts small as plot points grow.
- Summaries are chapter-based: once a summary "chapter" is saved (`useSummary`/`SummaryModal`), `buildGamePrompt` only includes messages *after* that chapter's `lastIndex` as live context, relying on the summary text to cover everything earlier. `buildSummaryPrompt` builds the input for *generating* a new summary chapter (everything since the last saved chapter).

### Streaming generation flow

`useOllama.generateStream` → `api.postStream` → backend `/api/ollama/generate-stream` ([node/routes/ollama.js](node/routes/ollama.js)) which calls `ollama.generate({ ..., stream: true })` and writes newline-delimited JSON chunks (Ollama's native stream format) directly to the HTTP response. The frontend buffers by line, JSON-parses each complete line, and appends `chunk.response` text into the last element of `messages` as it arrives (see `handleStream` in `GameMaster.jsx`), so the UI updates token-by-token. `chunk.done === true` signals end of generation.

### Modals

Two categories, driven by enums in [src/utils/enums.js](src/utils/enums.js): `useSmallModal` (confirm-style, e.g. save/load name prompt) and `useLargeModal` (full-screen editors — Plot Points, Quests, Settings, Summarize), switched on `LargeModalTypeEnum`/`SmallModalTypEnum`. Adding a new large modal means adding an enum value, a hook branch in `useLargeModal` usage in `GameMaster.jsx`, and a component under `src/components/`.
