import * as api from "./api.js";
import inquirer from "inquirer";
import cache from "./mock_database/search_cache.json";
import history from "./mock_database/search_history.json";

export async function handleKeywordSearch(keyword, cacheOption = false) {
    //   const searchCache = require("./mock_database/search_cache.json");
    
    try {
        const searchResults = await api.searchTastyAPI(keyword);
        saveToDatabase(searchResults);
        const selectedItem = await promptUserToSelect(searchResults);
        
        let detailedData;
        if (cacheOption) {
      detailedData = await retrieveFromCache(selectedItem);
    } else {
        detailedData = await retrieveFromAPI(selectedItem);
        saveToCache(selectedItem);
    }
    
    // Display detailed data to the user in a user-friendly format
    displayData(detailedData);
} catch (error) {
    console.error("An error occurred:", error);
}
}

function saveToDatabase(data) {
    history.push(data);
}

export async function handleSearchHistory(){
    displayData(history);
}

async function promptUserToSelect(searchResults) {
  const options = (searchResults ?? []).map((result, i) => ({
    name: `${i}. ${result.name}`,
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
  for (const )
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
function displayData(detailedData) {
  
}

