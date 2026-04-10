import { readdir, stat } from "node:fs/promises";
import { FileItem } from "../types.js";
import path from "node:path";

export const lsDir = async (dirPath: string): Promise<FileItem[]> => {
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
