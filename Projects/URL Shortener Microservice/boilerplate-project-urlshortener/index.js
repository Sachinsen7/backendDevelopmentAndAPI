require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

let db, urls;

const urlparser = require('url')
const dns = require('dns');
const { url } = require('inspector');


MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db("urlshortener");
    urls = db.collection("urls");
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  console.log(req.body)
  const url = req.body.url
  const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
    if(!address){
      res.json({error: "invalid url"})
    } else{

      const urlCount = await urls.countDocuments({})
      const urlDoc = {
        url,
        short_url: urlCount
      }

      const result = await urls.insertOne(urlDoc)
      console.log(result)
      res.json({original_url: req.body.url, short_url: urlCount})
    }
  })
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shorturl = req.params.short_url
  const urlDoc = await urls.findOne({short_url: +shorturl})

  if(urlDoc){
    res.redirect(urlDoc.url)
  } else {
    res.json({error: "no url found"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
