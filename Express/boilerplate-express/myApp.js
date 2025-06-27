require('dotenv').config();
const { json } = require('body-parser');
let express = require('express');
let app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());

app.use('/public', express.static(__dirname + '/public'));

// function logger(req, res, next){
//   console.log(`${req.method} ${req.path} - ${req.ip}`);
//   next();

// }

app.post("/name", (req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    const word = `${first} ${last}`
    res.json({
        name: word
    })
})

app.get("/now", (req, res, next) => {
    req.time = new Date().toString()
    next();
}, (req, res) => {
    res.json({
        time: req.time
    })
}) 

app.get("/:word/echo", (req, res) => {
    const word = req.params.word;
    res.json({
        echo: word
    })
})
//query

app.get("/name", (req, res) => {
    const first = req.query.first;
    const last = req.query.last;
    const word = `${first} ${last}`

    res.json({
        name: word
    })
})


// app.get("/json",  (req, res) => {
//   const messageStyle = process.env.MESSAGE_STYLE
//   const message = messageStyle === "uppercase" ? "HELLO JSON" : "Hello json";
//   res.json({ message });
// });

module.exports = app;

