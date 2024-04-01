import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { handleKeywordSearch, handleSearchHistory } from "./app.js";

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
