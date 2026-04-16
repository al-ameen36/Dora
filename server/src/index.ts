import express from "express";
import cors from "cors";
import os from "node:os";
import { copyFiles, deleteFiles, lsDir } from "./functions/file-ops.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = Number(process.env.PORT) || 3001;
const ROOT_DIR = os.homedir();

app.get("/ls", async (req, res) => {
  let path = req.query.path as string;
  if (!path) path = ROOT_DIR;

  path = decodeURIComponent(path);

  const files = await lsDir(path);
  res.json({ files, currentPath: path });
});

app.post("/copy", async (req, res) => {
  const { to, files } = req.body;

  await copyFiles({ files, to });

  res.json({ success: true });
});

app.delete("/delete", async (req, res) => {
  const { files } = req.body;

  await deleteFiles({ files });

  res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
