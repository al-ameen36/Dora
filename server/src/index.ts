import express from "express";
import { readdir, stat } from "node:fs/promises";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const ROOT_DIR = path.resolve(process.cwd()).split("/").slice(0, 3).join("/");

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

app.get("/ls", async (_req, res) => {
  const files = await lsDir(ROOT_DIR);
  res.json({ files });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
