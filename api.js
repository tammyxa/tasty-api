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
  }
}

export async function getTastyAPIDetails(identifier) {
  const options = {
    method: "GET",
    url: "https://tasty.p.rapidapi.com/recipes/list",
    params: {
      from: "0",
      size: "1",
      tags: "under_30_minutes",
      q: identifier,
    },
    headers: {
      "X-RapidAPI-Key": "a1a2ca24bamsh6ff242fbc2e1c54p139a6ejsnc9809288bc13",
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