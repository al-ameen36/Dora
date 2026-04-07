import express from "express";
import { readdir } from "node:fs/promises";
import path from "path";

const app = express();
const PORT = 3001;
const ROOT_DIR = path.resolve(process.cwd()).split("/").slice(0, 3).join("/");

const files = [
  {
    id: 1,
    filename: "webview2.exe",
    path: "webview2.exe",
  },
];

const lsDir = async (path: string) => {
  const list: string[] = [];
  try {
    const files = await readdir(path, { withFileTypes: true });
    for (const file of files) {
      if (file.name.startsWith(".")) continue;
      list.push(file.name);
    }
  } catch (err) {
    console.error(err);
  }

  return list;
};

app.get("/", async (_req, res) => {
  const files = await lsDir(ROOT_DIR);
  const html = `
    <ul>
        ${files.map((file) => `<li><a href="/file?file=${file}">${file}</a></li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/file/:id", async (req, res) => {
  const fileId = req.params.id;
  const relativePath = files.find((file) => file.id === Number(fileId))?.path;
  if (!relativePath) {
    res.status(404).send("File not found");
    return;
  }

  const filePath = path.join(ROOT_DIR, relativePath);
  res.download(filePath);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
