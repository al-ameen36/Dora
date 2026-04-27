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
  OpenctionPayload,
  PasteActionPayload,
} from "./types/files.js";
import { getSafePath } from "./helpers/safe-path.js";
import open from "open";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = Number(process.env.PORT) || 3001;
const ROOT_DIR = os.homedir();

app.get("/ls", async (req, res) => {
  let currentPath = req.query.path as string;
  const safePath = getSafePath(currentPath);

  if (!safePath) currentPath = ROOT_DIR + path.sep;

  const files = await lsDir(safePath);
  res.json({ files, currentPath: currentPath });
});

app.post("/copy", async (req, res) => {
  const { to, from, files }: CopyActionPayload = req.body;

  // await sleep(6);
  await copyFiles({
    files: files.map((f) => getSafePath(f.fullPath)),
    to: getSafePath(to),
  });

  res.json({ success: true, currentPath: getSafePath(to) });
});

app.post("/move", async (req, res) => {
  const { to, files }: PasteActionPayload = req.body;

  // await sleep(6);
  await moveFiles({
    files: files.map((f) => getSafePath(f.fullPath)),
    to: getSafePath(to),
  });

  res.json({ success: true, currentPath: getSafePath(to) });
});

app.delete("/delete", async (req, res) => {
  const { files, currentPath }: DeleteActionPayload = req.body;

  await deleteFiles({
    files: files.map((f) => getSafePath(f.fullPath)),
  });

  res.json({ success: true, currentPath: getSafePath(currentPath) });
});

app.post("/open", async (req, res) => {
  const { files }: OpenctionPayload = req.body;

  if (files.length === 0) res.json({ success: false });

  await open(getSafePath(files[0].fullPath));
  res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
