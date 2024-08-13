//initialization
const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//connect-check
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//middleware
app.use(cors());

//collections
const db = client.db("matrimony-server");
const biodataCollection = db.collection("biodata");
const successStories = db.collection("stories");

//routes start

app.get("/biodata", async (req, res) => {
  try {
    const result = await biodataCollection.find(req.query).toArray();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//1. get all/limited premium  biodata

app.get("/biodata/premium", async (req, res) => {
  try {
    const { limit, ageOrder } = req.query;
    const result = await biodataCollection
      .find({ biodata_status: "premium" })
      .limit(limit || 9999)
      .sort(ageOrder == "asc" ? { age: 1 } : { age: -1 })
      .toArray();

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//2. get a single biodata with all info
app.get("/biodata/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result =
      (await biodataCollection.findOne({ _id: new ObjectId(id) })) || {};

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/biodata/count/male", (req, res) => {
  try {
    const count = biodataCollection.countDocuments({ biodata_type: "male" });
    const result = { count };
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
app.get("/biodata/count/female", (req, res) => {
  try {
    const count = biodataCollection.countDocuments({ biodata_type: "female" });
    const result = { count };
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/biodata/count/marrige_status", (req, res) => {
  try {
    const count = biodataCollection.countDocuments({ marrige_status: true });
    const result = { count };
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/success", async (req, res) => {
  try {
    const result = await successStories.find().toArray();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/", async (req, res) => {
  res.send({});
});

//listener
app.listen(port, () => {
  console.log("server running.Port : ", port);
});
