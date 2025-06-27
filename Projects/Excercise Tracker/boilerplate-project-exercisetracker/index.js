const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  username: String
})

const UserModel = mongoose.model("User", UserSchema)

const ExcerciseSchema = new Schema({
  user_id: {type: String, required: true},
  description: String,
  duration: Number,
  date: Date
})


const ExcerciseModel = mongoose.model("Excercise", ExcerciseSchema)

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)


app.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find({}).select("_id username")
    res.json(users)
  } catch (error) {
    console.error(error)
  }
})



app.post("/api/users", async(req, res) => {
  const userObj = new UserModel({
    username: req.body.username
  })

  try {
    const user = await userObj.save()
    console.log(user)
    res.json(user)
  } catch (error) {
    console.error(error)
  }
})



app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id

  const {description, duration, date} = req.body
  try {
    const user = await UserModel.findById(id)
    if(!user){
      return res.json({error: "no user found"})
    }

    const excerciseObj = new ExcerciseModel({
      user_id: id,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    })

    const excercise = await excerciseObj.save()
    console.log(excercise)
    res.json({
      _id: user._id,
      username: user.username,
      description: excercise.description,
      duration: excercise.duration,
      date: new Date(excercise.date).toDateString(),
    })
  } catch (error) {
    console.error(error)
    res.send("there was an error")
  } 
})



app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.json({ error: "no user found" });
    }

    let dateFilter = {};
    if (from) dateFilter["$gte"] = new Date(from);
    if (to) dateFilter["$lte"] = new Date(to);

    let filter = { user_id: id };
    if (from || to) filter.date = dateFilter;

    const exercises = await ExcerciseModel.find(filter).limit(limit ? parseInt(limit) : 500);

    const log = exercises.map((e) => ({
      description: String(e.description),
      duration: Number(e.duration),
      date: new Date(e.date).toDateString(), // ensure it’s formatted properly
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: log.length,
      log // 🔥 must be `log` not `logs`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
