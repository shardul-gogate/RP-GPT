import { readFile, writeFile } from "../utils/fileHelpers.js";
import { FilePaths, ApiPaths } from "../utils/constants.js";

export default function register(app) {
  app.get(ApiPaths.Api_PlotPoints, async (req, res) => {
    try {
      const data = await readFile(FilePaths.FilePath_PlotPoints);
      res.json({
        ok: true,
        message: "Plot points retrieved successfully",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: "Failed to retrieve plot points",
        error: err.message,
      });
    }
  });

  app.post(ApiPaths.Api_PlotPoints, async (req, res) => {
    try {
      await writeFile(FilePaths.FilePath_PlotPoints, req.body);
      res.json({ ok: true, message: "Plot points saved successfully" });
    } catch (err) {
      res.status(500).json({
        ok: false,
        message: "Failed to save plot points",
        error: err.message,
      });
    }
  });
}
