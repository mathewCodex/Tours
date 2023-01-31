const mongoose = require("mongoose");
const dotenv = require("dotenv");

//////////////////////
//creating an uncaught Exception function 
process.on('uncaughtException', err => {
   console.log("UnCaught Exception...Shuting Down....");
     console.log(err.name, err.message);
     process.exit(1);
})







/////////////////////
dotenv.config({ path: "./config.env" });
const app = require("./app");

//starting server/////

const DB = process.env.DATABASE;
// console.log(process.env);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully")); 

/* not needed anymore....
//creating documents and testing module new variable
// const testTour = new Tour({name: 'The Park Camper',price:997});
// //saving the docs to the data base and using the then method to have access to the docs
// testTour.save().then(doc => {
//   console.log(doc);

// }).catch(err => {
//   console.log('ERROR :', err)
// })
// */



///////////////
const port = process.env.PORT || 4000;
// const port = 4000;
const server = app.listen(port, () => {
  console.log(`App Is running at ${port}...`);
});


process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection...Shuting Down....')
  server.close(() => {
    process.exit(1);
  })

});
