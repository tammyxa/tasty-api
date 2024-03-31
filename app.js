import * as api from "./api.js";
import * as db from "./db.js";
import inquirer from "inquirer";

export async function handleKeywordSearch(keyword, cacheOption = false) {
  try {
    const searchResults = await api.searchTastyAPI(keyword);
    await db.create("search_history", searchResults);
    const selectedItem = await promptUserToSelect(searchResults);

    let detailedData;
    if (cacheOption) {
      detailedData = await db.create("search_cache", selectedItem);
    } else {
      return await db.find("search_cache", selectedItem.id);
    }

    // Display detailed data to the user in a user-friendly format
    displayData(selectedItem, false);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function handleSearchHistory() {
  displayData(await db.find("search_history"), true);
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

// Function to retrieve detailed data for the selected item from the cache
async function retrieveFromCache(selectedItem) {
  //   for (const )
}

// Function to retrieve detailed data for the selected item from the API
async function retrieveFromAPI(selectedItem) {
  try {
    const response = await axios.get(`API_ENDPOINT/${selectedItem.id}`); // Replace API_ENDPOINT with the actual endpoint URL and selectedItem.id with the unique identifier of the selected item
    return response.data; // Return the response data
  } catch (error) {
    // Handle any errors (e.g., network error, server error)
    console.error("Error retrieving data from API:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Function to display detailed data to the user in a user-friendly format
function displayData(detailedData, history) {
  if (history) {
    detailedData.forEach((dish, i) => {
      console.log(i, dish.name);
    });
  } else {
    detailedData.forEach((dish, i) => {
      console.log(i, dish.name);
      dish.instructions.forEach((step, j) => {
        console.log(j, step);
      });
    });
  }
}
