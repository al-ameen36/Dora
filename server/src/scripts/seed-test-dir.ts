import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const TEST_DIR_NAME = "dora-test-bench";
const TOTAL_FILES = 1000;
const MAX_DEPTH = 3;

async function createTestBench() {
  const rootPath = path.join(os.homedir(), TEST_DIR_NAME);

  try {
    // 1. Clean start
    await fs.rm(rootPath, { recursive: true, force: true });
    await fs.mkdir(rootPath, { recursive: true });

    console.log(`🚀 Generating ${TOTAL_FILES} files in ${rootPath}...`);

    for (let i = 0; i < TOTAL_FILES; i++) {
      // Determine a random nested path
      let currentDepth = Math.floor(Math.random() * (MAX_DEPTH + 1));
      let subDirs = [];
      for (let d = 0; d < currentDepth; d++) {
        subDirs.push(`folder_${d + 1}`);
      }

      const dirPath = path.join(rootPath, ...subDirs);
      await fs.mkdir(dirPath, { recursive: true });

      // Generate varied file types and sizes
      const ext = i % 5 === 0 ? ".pdf" : i % 3 === 0 ? ".jpg" : ".txt";
      const fileName = `test_file_${i}${ext}`;
      const filePath = path.join(dirPath, fileName);

      // Create files of varying sizes (0KB to 5MB)
      const contentSize = Math.floor(Math.random() * 5 * 1024 * 1024);
      const buffer = Buffer.alloc(contentSize, "a");

      await fs.writeFile(filePath, buffer);

      if (i % 100 === 0) console.log(`...created ${i} files`);
    }

    console.log(`✅ Success! Test bench ready at: ${rootPath}`);
    console.log(
      `💡 Pro-tip: Open this in your File Explorer to test virtualization.`,
    );
  } catch (err) {
    console.error("❌ Error generating test bench:", err);
  }
}

createTestBench();
