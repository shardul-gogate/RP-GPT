import { readFile, writeFile } from "../utils/fileHelpers.js";
import { FilePaths, ApiPaths } from "../utils/constants.js";

export default function register(app) {
  app.get(ApiPaths.Api_Progress, async (req, res) => {
    try {
      const data = await readFile(FilePaths.FilePath_Progress);
      res.json({
        ok: true,
        message: "Progress retrieved successfully",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: "Failed to retrieve progress",
        error: err.message,
      });
    }
  });

  app.post(ApiPaths.Api_Progress, async (req, res) => {
    try {
      await writeFile(FilePaths.FilePath_Progress, req.body);
      res.json({ ok: true, message: "Progress saved successfully" });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: "Failed to save progress",
        error: err.message,
      });
    }
  });
}
