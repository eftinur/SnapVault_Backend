// Importing Modules
const express = require("express");
const cors = require("cors");

require("dotenv").config(); // A package to secure important data

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors()); // A package for allowing remote hosts to access resources
app.use(express.json()); // A built-in middleware function in Express. It parses incoming requests with JSON payloads

// terminal Tests
app.listen(port, () => {
  console.log(`listening to port: ${port}`);
});

// Root API routes
app.get("/", (req, res) => {
  res.send("SnapVault is running");
});

// MongoDB Database Config and API routes
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tyocyp7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Database connected!");

    // Creating Database Collections
    const postsCollection = client.db("SnapVault").collection("posts");
    
    // API routes
    // API to get posts data sorted descendently
    app.get("/posts", async (req, res) => {
      let query = {};
      if (req.query.user_email) {
        query = { user_email: req.query.user_email };
      }
      const posts = await postsCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(posts);
    });

    // API to save posts data
    app.post("/posts", async (req, res) => {
      const newPost = req.body;
      const result = await postsCollection.insertOne(newPost);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);