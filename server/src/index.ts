import express from "express";
import cors from "cors";
import { readdir, stat } from "node:fs/promises";
import path from "path";
import os from "os";

const app = express();
app.use(cors());
const PORT = Number(process.env.PORT) || 3001;
const ROOT_DIR = os.homedir();

type FileItem = {
  name: string;
  isDirectory: boolean;
  size: number;
};

const lsDir = async (dirPath: string): Promise<FileItem[]> => {
  const list: FileItem[] = [];

  try {
    const files = await readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      if (file.name.startsWith(".")) continue;

      const fullPath = path.join(dirPath, file.name);

      let size = 0;

      // Only files need size (folders are tricky/expensive)
      if (file.isFile()) {
        try {
          const stats = await stat(fullPath);
          size = stats.size;
        } catch (err) {
          console.error("stat error:", err);
        }
      }

      list.push({
        name: file.name,
        isDirectory: file.isDirectory(),
        size,
      });
    }
  } catch (err) {
    console.error(err);
  }

  return list;
};

app.get("/ls", async (req, res) => {
  let path = req.query.path as string;
  if (!path) path = ROOT_DIR;

  path = decodeURIComponent(path);

  const files = await lsDir(path);
  res.json({ files, currentPath: path });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
