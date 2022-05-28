const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json())

//mongo


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cool-tools.odpoa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db("cool").collection("tools");
        const userToolsCollection = client.db("cool").collection("userTools");
        const ReviewCollection = client.db("cool").collection("review");
        const userCollection = client.db("cool").collection("user");



        //Get All

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)

        })
        //Get One
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolsCollection.findOne(query);
            res.send(tool)
        })
        //review
        //create fruit
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await ReviewCollection.insertOne(newReview);
            res.send(result)
        })
        //Get All

        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = ReviewCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)

        })

        // create a tools for users
        app.post('/userTools', async (req, res) => {
            const newTools = req.body;
            const result = await userToolsCollection.insertOne(newTools);
            res.send(result)
        })
        //get all tools for user
        app.get('/userTools', async (req, res) => {
            const query = {};
            const cursor = userToolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)

        })
        //get one user tools
        app.get('/userTools/:email', async (req, res) => {
            console.log(req.params)
            const email = req.params.email;
            const query = { email: email };
            const cursor = await userToolsCollection.find(query);
            const documents = await cursor.toArray()
            res.send(documents)

        })

        //delete one user tools
        //Delete
        app.delete('/userTools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userToolsCollection.deleteOne(query);
            res.send(result)
        })
        //user
    }
    finally {

    }
}
run().catch(console.dir)
// client.connect(err => {

//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`App working http://localhost:${port}`)
})