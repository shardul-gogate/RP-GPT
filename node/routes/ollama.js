import ollama from 'ollama';
import { ApiPaths, Ollama_Host_URL } from '../utils/constants.js';

export default function register(app) {
  app.get(ApiPaths.Api_Ollama_Models, async (_req, res) => {
    try {
      const response = await ollama.list();
      res.json({
        ok: true,
        message: 'Ollama models retrieved successfully',
        data: response.models,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: 'Failed to retrieve Ollama models. Is Ollama running?',
        error: err.message,
      });
    }
  });

  app.post(ApiPaths.Api_Ollama_Generate_Stream, async (req, res) => {
    const { prompt, model, system, options } = req.body;

    try {
      const payload = {
        model,
        prompt,
        system,
        options,
        stream: true,
        think: false
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await ollama.generate(payload);

      for await (const chunk of stream) {
        res.write(JSON.stringify(chunk) + '\n');
      }

      res.end();

    } catch (err) {
      // This will not be sent to the client if headers are already sent
      if (!res.headersSent) {
        return res
          .status(500)
          .json({
            ok: false,
            message: "An unexpected error occurred",
            error: err.message,
          });
      } else {
        console.error("An error occurred after headers were sent:", err);
        res.end(); // End the stream
      }
    }
  });
}
