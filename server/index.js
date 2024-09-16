const express = require ('express');
const app = express();
//const port = 3002;

const port = process.env.PORT || 3002

const cors = require ('cors')


//middleware

app.use(cors());
app.use(express.json());




app.get('/', (req, res)=>{
    res.send('Hello World!');
});


//mongodb Connection


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:5CsGY6gygqXLgERi@cluster0.p7nhu5m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    //Create  a collection of database

    const booksCollection = client.db("BookInventory").collection("books");

    //insert a book to database using post method

    app.post("/upload-book", async (req,res)=>{
        const data = req.body;
        const result = await booksCollection.insertOne(data);
        res.send(result);
    })


    //get all book
    // app.get('/all-books', async(req, res)=>{
    //     const books = booksCollection.find();
    //     const result = await books.toArray();
    //     res.send(result);
    // })


    //update a book using patch method
    app.patch("/book/:id",async(req,res) => {
      const id = req.params.id;
      // console.log(id);
      const updateBookData = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };

      const updateDoc = {
        $set : {
          ...updateBookData
        }
      }

      //update
      const result = await booksCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })


    //delete a book
    app.delete("/book/:id", async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await booksCollection.deleteOne(filter);
      res.send(result);
    })

    //find by category

    app.get("/all-books", async (req, res) => {
      try {
        let query = {};
        // Check if category query parameter is present
        if (req.query?.category) {
          query = { category: req.query.category };
        }
    
        // Fetch books based on the query
        const books = booksCollection.find(query);
        const result = await books.toArray();
        res.send(result);
      } catch (err) {
        console.error(`Error retrieving books: ${err}`); // Debugging
        res.status(500).send(err);
      }
    });
    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`Server and nel listening on ${port}`);
})