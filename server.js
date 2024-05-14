import MongoDB from "./services/db.js";
import express from "express";
import searchRouter from "./routes/search.js";

// Create Express app
const app = express();
let db;
// Connect to MongoDB
try {
  //instantiate a new MongoDB
  db = new MongoDB();

  //connect to Mongo
  await db.connect();
} catch (error) {
  console.error("Error: ", error);
} finally {
  await db.close();
}
app.use("/search", searchRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
