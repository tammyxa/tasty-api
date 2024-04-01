import axios from "axios";

export async function searchTastyAPI(keyword) {
  const options = {
    method: "GET",
    url: "https://tasty.p.rapidapi.com/recipes/list",
    params: {
      from: "0",
      size: "3",
      tags: "under_30_minutes",
      q: keyword,
    },
    headers: {
      "X-RapidAPI-Key": "6f15063c3bmshf4bcb7eca9f8351p158110jsn64e010060860",
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {
    console.error("API Request Fail", error);
    throw error;
  }
}

export async function getTastyAPIDetails(recipeId) {
  const options = {
    method: "GET",
    url: "https://tasty.p.rapidapi.com/recipes/get-more-info",
    params: {
      id: recipeId,
    },
    headers: {
      "X-RapidAPI-Key": "6f15063c3bmshf4bcb7eca9f8351p158110jsn64e010060860",
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}
