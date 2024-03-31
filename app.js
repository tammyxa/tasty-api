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
      // Check if data is available in the cache
      const cachedData = await db.find("search_cache", keyword);

      if (cachedData) {
        // If data is found in the cache, use it
        detailedData = cachedData;
      } else {
        // If data is not found in the cache, fetch it from the API
        detailedData = await api.getTastyAPIDetails(
          selectedItem.uniqueIdentifier
        );

        // Save fetched data to the cache
        await db.create("search_cache", { detailedData });
      }
    } else {
      detailedData = await api.getTastyAPIDetails(
        selectedItem.uniqueIdentifier
      );
      await db.create("search_cache", detailedData);
    }

    // Display detailed data to the user in a user-friendly format
    displayData(detailedData);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function handleSearchHistory() {
  const historyData = await db.find("search_history");
  console.log("Search History:");
  historyData.forEach((e, i) => console.log(i + 1 + ". " + e.search));
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
  console.log(
    detailedData.results[0].name + "\n_____________________________\n"
  );
  detailedData.results[0].nutrition.forEach((n) => console.log(n + "\n"));
  console.log("Instructions:\n");
  detailedData.results[0].instructions.forEach((instruction) =>
    console.log(instruction + "\n")
  );
}
