import * as api from "../services/api.js";
import express from "express";

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
    console.log(minimalResults);
    // res.json(minimalResults);
  } catch (error) {
    console.log("error in get/search", error);
  }
});

export default router;
