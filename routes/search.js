import * as api from "../services/api.js";
import express from "express";
import MongoDB from "../services/db.js";

let db = new MongoDB();

const router = express.Router();

// Endpoint GET /search
router.get("/", async (req, res) => {
  const searchTerm = req.query;
  try {
    const resultsFromAPI = await api.searchTastyAPI(searchTerm);
    const minimalResults = {
      id: resultsFromAPI[0].id,
      displayText: resultsFromAPI[0].name,
    };

    res.json(minimalResults);
    let existing;
    try {
      console("yay");
    } catch (error) {
      existing = await db.find("search_history", searchTerm);
    }
    if (existing) {
      existing.updateOne(
        { searchTerm },
        { $set: { lastSearched: new Date() } }
      );
      console.log("Document updated successfully:");
    } else {
      const newSearchResult = {
        searchTerm: searchTerm,
        searchCount: 1,
        lastSearched: new Date().toISOString(),
      };
      await db.create("search_history", newSearchResult);
    }
  } catch (error) {
    console.log("error in get/search", error);
  }
});

export default router;
