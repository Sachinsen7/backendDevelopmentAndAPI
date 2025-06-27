require('dotenv').config();
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

console.log("URI:", process.env.MONGO_URI);

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const document = new Person({
    name: "John",
    age: 30,
    favoriteFoods: ["apple", "banana"]
  });

  document.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });

  
};

let arrayOfPeople = [
  {name: "John", age: 30, favoriteFoods: ["apple", "banana"]},
  {name: "John", age: 30, favoriteFoods: ["apple", "banana"]},
  {name: "John", age: 30, favoriteFoods: ["apple", "banana"]}
];

const createManyPeople = (arrayOfPeople, done) => {
  
  Person.create(arrayOfPeople, function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  })
  
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  })

};

const findOneByFood = (food, done) => {

  Person.findOne({favoriteFoods: food}, function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  })
  
};

const findPersonById = (personId, done) => {

  Person.findById(personId, function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  })
  
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, function(err, person) {
    if (err) return done(err); // use done instead of console.error

    person.favoriteFoods.push(foodToAdd);

    person.save(function(err, updatedPerson) {
      if (err) return done(err); // again, use done for error

      return done(null, updatedPerson); // return final updated data
    });
  });
};


const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },       // Search condition
    { age: ageToSet },          // Update operation
    { new: true },              // Return updated document
    (err, updatedDoc) => {
      if (err) return done(err);
      return done(null, updatedDoc);
    }
  );
};


const removeById = (personId, done) => {
  
  Person.findByIdAndRemove(personId, function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  })
  
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select({age: 0})
    .exec(function(err, data) {
      if (err) return console.error(err);
      done(null, data)
    })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
