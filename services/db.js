import path from "path";
import url from "url";

import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

// in ECMAScript Modules (ESM), __dirname is not available directly like in CommonJS
// use 'url' and 'path' modules to achieve similar functionality
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// define the path to the mock database directory
const dbDirectory = path.resolve(__dirname, "mock_database");

class MongoDB {
  /**
   * constructor
   * Loads a .env, initializes a MongoDB connection URL using environment variables,
   * and sets up properties for the MongoDB client and database
   */
  constructor() {
    dotenv.config();
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
    const mongoURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
    this.client = new MongoClient(mongoURL);
    this.db = null;
  }

  /**
   * Opens a connection to the MongoDB database
   */
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Connecting to Mongo DB Error:", error);
      throw error;
    }
  }

  /**
   * Closes the connection to the MongoDB database.
   */

  async close() {
    try {
      await this.client.close();
      console.log("Closed connection to MongoDB");
    } catch (error) {
      console.error("Closing Connection to Mongo DB Error:", error);
      throw error;
    }
  }

  /**
   * Creates a new document in the specified collection
   * @param {string} collectionName - the name of the collection
   * @param {Object} data - the data to be inserted into the collection
   * @returns {Promise<Object>} - a Promise that resolves with the acknoledgement document
   */

  async create(collectionName, data) {
    try {
      const database = this.client.db();
      const collection = database.collection(collectionName);
      const result = await collection.insertOne(data);
      return result;
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  /**
   * Finds documents by their _id in the specified collection
   * @param {string} collectionName - the name of the collection
   * @param {string} _id - the _id of the document to find
   * @returns {Promise<Cursor>} - a Promise that resolves with the cursor
   */

  async find(collectionName, _id) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.findOne({ _id: new ObjectId(_id) });
      return result;
    } catch (error) {
      console.error("Error finding document by _id:", error);
      throw error;
    }
  }
}

export default MongoDB;
