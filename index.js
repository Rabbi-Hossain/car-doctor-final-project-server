const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000

// middle ware

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.dqtrbnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const carDoctorDemoCollection = client.db('carDoctorFinalDemo').collection('services')
    const carDoctorBookingDemoCollection = client.db('carDoctorFinalDemo').collection('Booking')


    // service

    app.get('/services', async(req, res)=>{
      const cursor = await carDoctorDemoCollection.find().toArray()
      res.send(cursor)
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}

      const options = {
        projection: {title:1, img:1, price:1 }
      }

      const result = await carDoctorDemoCollection.findOne(query, options)
      res.send(result)
    })



    // booking

    app.get('/booking', async(req, res)=>{
      console.log(req.query.email)
      let query = {}
      if(req.query?.email){
        query={email:req.query?.email}
      }

      const cursor = await carDoctorBookingDemoCollection.find(query).toArray()
      res.send(cursor) 
    })


    app.post('/booking', async(req,res)=>{
      const id = req.body
      console.log(id)
      const result = await carDoctorBookingDemoCollection.insertOne(id)
      res.send(result)
    })


    app.patch('/booking/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const booking = req.body

      const updateDoc = {
        $set: {
          plot: {
            status: booking.status
          }
        },
      };

      const result = await carDoctorBookingDemoCollection.updateOne(query,updateDoc)
      res.send(result)
      
    })

    app.delete('/booking/:id', async(req, res)=>{

      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await carDoctorBookingDemoCollection.deleteOne(query)
      res.send(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('hellow word car doctor client')
})

app.listen(port, ()=>{
    console.log(`server is running port: ${port}`)
})