#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
// import { searchTastyAPI, getTastyAPIDetails } from "./api.js";
import { handleKeywordSearch, handleSearchHistory } from "./app.js";

// Define command-line interface using Yargs
const argv = yargs(hideBin(process.argv))
  .command(
    "search <keyword>",
    "Search a under 30 minute recipe that contains the given ingredient",
    (yargs) => {
      yargs.option("cache", {
        alias: "c",
        describe: "Return cached results when available",
        type: "boolean",
        default: false,
      });
    },
    async (argv) => {
      const { keyword, cache } = argv;
      await handleKeywordSearch(keyword, cache);
    }
  )
  .command(
    "history",
    "Get history on previous searches",
    () => {},
    async () => {
      await handleSearchHistory();
    }
  )
  .demandCommand()
  .help().argv;
