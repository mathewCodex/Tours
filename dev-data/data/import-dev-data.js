const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
const User = require("../../models/UserModel");
const Review = require("../../models/reviewModel")
const mongoose = require("mongoose");
//starting server/////
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE;
// console.log(process.env);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully"));
//READ JSON FILE...
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/review.json`, "utf-8"));
//IMPORT DATA INTO DB
const importData = async () => {
  
  try {
    await Tour.create(tours);
   await User.create(users, {validateBeforeSave: false});
   await Review.create(reviews)
    console.log("Data succefully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
     await User.deleteMany();
      await Review.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} 
