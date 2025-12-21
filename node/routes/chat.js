import { Ollama_Host_URL } from "../utils/constants.js";

export default function register(app) {
  app.post("/api/chat", async (req, res) => {
    const { prompt, model } = req.body;

    try {
      const payload = {
        model,
        prompt,
        stream: false,
      };

      const r = await fetch(`${Ollama_Host_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const errText = await r.text();
        return res
          .status(502)
          .json({
            ok: false,
            message: "Ollama error",
            error: errText,
          });
      }

      const data = await r.json();
      return res.json({
        ok: true,
        message: "Chat successful",
        data: data.response,
      });
    } catch (err) {
      return res
        .status(500)
        .json({
          ok: false,
          message: "An unexpected error occurred",
          error: err.message,
        });
    }
  });
}
