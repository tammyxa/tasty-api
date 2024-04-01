import * as api from "./api.js";
import * as db from "./db.js";
import inquirer from "inquirer";

export async function handleKeywordSearch(keyword, cacheOption = false) {
  try {
    const searchResults = await api.searchTastyAPI(keyword);
    const data = {
      search: keyword,
      resultCount: searchResults.length,
      searchResults: searchResults,
    };
    await db.create("search_history", data);
    const selectedItem = await promptUserToSelect(searchResults);

    let detailedData;
    if (cacheOption) {
      detailedData = await db.find("search_cache", selectedItem.id);
      if (!detailedData) {
        detailedData = await api.getTastyAPIDetails(selectedItem.id);
        await db.create("search_cache", detailedData);
      }
      detailedData = await db.find("search_cache", selectedItem.id);
      if (!detailedData) {
        detailedData = await api.getTastyAPIDetails(selectedItem.id);
        await db.create("search_cache", detailedData);
      }
    } else {
      detailedData = await api.getTastyAPIDetails(selectedItem.id);
      detailedData = await api.getTastyAPIDetails(selectedItem.id);
    }

    // Display detailed data to the user in a user-friendly format
    displayData(detailedData);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function handleSearchHistory() {
  try {
    const historyData = await db.find("search_history");
    console.log("Search History:");
    historyData.forEach((e, i) => console.log(i + 1 + ". " + e.search));
  } catch (error) {
    console.error("Failed to retrieve search history:", error);
  }
}

async function promptUserToSelect(searchResults) {
  const options = (searchResults ?? []).map((result, i) => ({
    name: `${i + 1}. ${result.name}`,
    value: result,
  }));

  const { selectedResult } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedResult",
      message: "Select a dish:",
      choices: options,
    },
  ]);

  return selectedResult;
}

// Function to display detailed data to the user in a user-friendly format
function displayData(detailedData) {
  console.log("\n" + detailedData.name.toUpperCase() + "\n");
  console.log(detailedData.description + "\n_____________________________\n");
  console.log("Instructions:\n");
  detailedData.instructions.forEach((step, i) =>
    console.log(`${i + 1}. ${step.display_text}`)
  );
}
