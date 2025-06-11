import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, "src", "models");

function fixImports(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fixImports(filePath);
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(filePath, "utf8");

      // Fix collection import
      content = content.replace(
        /import\s+Collection\s+from\s+['"]\.\.\/\.\.\/config\/collection['"]/g,
        'import Collection from "../../config/collection.config.js"',
      );

      // Fix enums import
      content = content.replace(
        /import\s+Enum\s+from\s+['"]\.\.\/\.\.\/config\/enums['"]/g,
        'import Enum from "../../config/enums.config.js"',
      );

      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports in ${filePath}`);
    }
  });
}

fixImports(modelsDir);
