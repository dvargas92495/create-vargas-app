#!/usr/bin/env node
import validateNpmName from 'validate-npm-package-name';
import chalk from 'chalk';

const projectName = process.argv[2];
console.log("Creating app...", projectName);

const { validForNewPackages, errors, warnings  } = validateNpmName(projectName)
if (!validForNewPackages) {
  console.error(
    `Could not create a project called ${chalk.red(
      `"${projectName}"`
    )} because of npm naming restrictions:`
  )

  errors?.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`))
  warnings?.forEach((p) => console.warn(`    ${chalk.yellow.bold('*')} ${p}`))
  process.exit(1)
}
