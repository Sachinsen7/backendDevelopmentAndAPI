// index.js

var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Helper function
const isInvalidDate = (date) => date.toUTCString() === 'Invalid Date';

// API with date param
app.get("/api/:date", function (req, res) {
  const input = req.params.date;
  let date;

  // Try to convert input to number (for Unix timestamp)
  if (!isNaN(input)) {
    date = new Date(Number(input));
  } else {
    date = new Date(input);
  }

  if (isInvalidDate(date)) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// API without date param (returns current time)
app.get("/api", (req, res) => {
  const now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString()
  });
});

// Server listen
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
