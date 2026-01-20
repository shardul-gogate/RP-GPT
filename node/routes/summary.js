import { readFile, writeFile } from '../utils/fileHelpers.js';
import { FilePaths, ApiPaths } from '../utils/constants.js';
import ollama from 'ollama';

export default function register(app) {
  app.get(ApiPaths.Api_Summary, async (req, res) => {
    try {
      const data = await readFile(FilePaths.FilePath_Summary);
      res.json({
        ok: true,
        message: 'Summary retrieved successfully',
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: 'Failed to retrieve summary',
        error: err.message,
      });
    }
  });

  app.post(ApiPaths.Api_Summary, async (req, res) => {
    try {
      await writeFile(FilePaths.FilePath_Summary, req.body);
      res.json({ ok: true, message: 'Summary saved successfully' });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: 'Failed to save Summary',
        error: err.message,
      });
    }
  });

  app.post(ApiPaths.Api_Generate_Summary, async (req, res) => {
    const { prompt, model, system, options } = req.body;

    try {
      const payload = {
        model,
        prompt,
        system,
        options,
        stream: false
      };
      const response = await ollama.generate(payload);
      res.json({ ok: true, message: 'Summary generated successfully', data: response.response });
    } catch (err) {
      res.status(500).json({ ok: false, message: 'Failed to generate summary', error: err.message });
    }
  });
}