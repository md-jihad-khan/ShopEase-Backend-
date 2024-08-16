const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.iq3jpr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
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
    const database = client.db("Shop-Ease");
    const productsCollection = database.collection("Products");

    app.get("/products", async (req, res) => {
      const search = req.query.search || "";
      const sortPrice = req.query.sortPrice;
      const sortDate = req.query.sortDate;
      const brand = req.query.brand;
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const skip = (page - 1) * limit;

      let sortOption = {};

      if (sortPrice === "price_asc") {
        sortOption.price = 1; // Sort by price Low to High
      } else if (sortPrice === "price_desc") {
        sortOption.price = -1; // Sort by price High to Low
      }

      if (sortDate === "date_desc") {
        sortOption.createdAt = -1; // Sort by date Newest first
      } else if (sortDate === "date_asc") {
        sortOption.createdAt = 1; // Sort by date Oldest first
      }

      // Build the search query
      let query = search ? { name: { $regex: search, $options: "i" } } : {};

      if (brand) {
        query.brand = brand;
      }

      // Find the products with the search query, pagination
      const products = await productsCollection
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .toArray();

      // Count the number of documents that match the search query
      const total = await productsCollection.countDocuments(query);

      res.send({
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
