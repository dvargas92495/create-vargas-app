#!/usr/bin/env node
import validateNpmName from "validate-npm-package-name";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import os from "os";
import { sync } from "cross-spawn";
import cpy from "cpy";

const projectName = process.argv[2];
const run = async () => {
  console.log("Creating app...", chalk.green(projectName));
  console.log();

  const { validForNewPackages, errors, warnings } = validateNpmName(
    projectName
  );
  if (!validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    );

    errors?.forEach((p) => console.error(`    ${chalk.red.bold("*")} ${p}`));
    warnings?.forEach((p) =>
      console.warn(`    ${chalk.yellow.bold("*")} ${p}`)
    );
    process.exit(1);
  }

  const root = path.resolve(projectName);
  fs.mkdirSync(projectName);

  const packageJson = {
    name: projectName,
    version: "1.0.0",
    scripts: {
      dev: "next",
      build: "next build",
      start: "next start",
      lint: "tsc",
      export: "next export",
    },
    dependencies: {
      "@dvargas92495/ui": "^0.6.1",
      next: "latest",
      react: "^16.12.0",
      "react-dom": "^16.12.0",
    },
    devDependencies: {
      "@types/node": "^12.12.21",
      "@types/react": "^16.9.16",
      "@types/react-dom": "^16.9.4",
      typescript: "4.0",
    },
    license: "MIT",
  };

  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  await sync("npm", ["install", "--save", "--save-exact"]);

  await cpy('**', root, {
    parents: true,
    cwd: path.join(__dirname, 'template'),
  })

  await sync("git init", { stdio: "ignore" });
  await sync("git add -A", { stdio: "ignore" });
  await sync('git commit -m "Initial commit from Create Vargas App"', {
    stdio: "ignore",
  });
};

run();
