#!usr/bin/env node

import { program } from "commander";
import { showMainMenu } from "../src/trivia.js"
import gameStats from "../src/gameStats.js"

await showMainMenu(gameStats);
program.parse(process.argv);