import fs from "fs";
import path from "path";

const emojiRegex = /\p{Extended_Pictographic}/u;

function scanDir(dir, findings) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next") {
        scanDir(fullPath, findings);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        // Exclude star symbol ★ if needed, but let's see what matches
        const matches = line.match(emojiRegex);
        if (matches) {
          findings.push({ file: fullPath, line: index + 1, match: matches[0], text: line.trim() });
        }
      });
    }
  }
}

const findings = [];
scanDir("./src", findings);

if (findings.length === 0) {
  console.log("No emojis detected in src/! Iconography standard verified.");
} else {
  console.log(`Found ${findings.length} potential emoji instances:`);
  findings.forEach((f) => {
    console.log(`- ${f.file}:${f.line} -> "${f.match}" in "${f.text}"`);
  });
}
