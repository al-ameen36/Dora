import express from "express";
import cors from "cors";
import os from "os";
import path from "path";
import {
  copyFiles,
  deleteFiles,
  lsDir,
  moveFiles,
} from "./functions/file-ops.js";
import {
  CopyActionPayload,
  DeleteActionPayload,
  PasteActionPayload,
} from "./types/files.js";
import { getSafePath } from "./helpers/safe-path.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = Number(process.env.PORT) || 3001;
const ROOT_DIR = os.homedir();

app.get("/ls", async (req, res) => {
  let currentPath = req.query.path as string;
  if (!currentPath) currentPath = ROOT_DIR;

  const files = await lsDir(getSafePath(ROOT_DIR, currentPath));
  res.json({ files, currentPath: currentPath });
});

app.post("/copy", async (req, res) => {
  const { to, files }: CopyActionPayload = req.body;

  // await sleep(6);
  await copyFiles({
    files: files.map((f) => f.fullPath),
    to: getSafePath(ROOT_DIR, to),
  });

  res.json({ success: true, currentPath: getSafePath(ROOT_DIR, to) });
});

app.post("/move", async (req, res) => {
  const { to, files }: PasteActionPayload = req.body;

  // await sleep(6);
  await moveFiles({
    files: files.map((f) => f.fullPath),
    to: getSafePath(ROOT_DIR, to),
  });

  res.json({ success: true, currentPath: getSafePath(ROOT_DIR, to) });
});

app.delete("/delete", async (req, res) => {
  const { files, currentPath }: DeleteActionPayload = req.body;

  await deleteFiles({
    files: files.map((f) => getSafePath(ROOT_DIR, f.fullPath)),
  });

  res.json({ success: true, currentPath: getSafePath(ROOT_DIR, currentPath) });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
