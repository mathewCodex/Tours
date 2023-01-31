const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
//
const Tour = require("./tourModel")
const validator = require("validator");
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required:[true, "review cant be empty"]

  },
 rating:{
    type:Number,
    min:1,
    max:5
 },
 createdAt:{
    type:Date,
    default: Date.now
 },

 tour:{
   type:mongoose.Schema.ObjectId,
   ref:'Tour',
   required:[true,'Review must belong to a tour.']
 },
 //want to know who wrote a certain review
 
 user:{
  type:mongoose.Schema.ObjectId,
  ref:'User',
  required:[true,"review Must belong to a user"]
 }
},
//making virtual properties to show up in json and other output 
//that means a field that is not stored in the database but calculated using some other value can be stored 
{
   toJSON:{virtuals:true},
   toObject:{virtuals:true}
 });
//avoiding duplicate keys
reviewSchema.index({tour: 1,user: 1}, {unique:true})
 //implementing our pre find
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name"
  // }).populate({
  //   path:'user',
  //   select:"name photo"
  // });
 this.populate({
    path:'user',
    select:"name photo"
  });
  next();
});

//creating a statics method that can get us data accordin to the query
reviewSchema.statics.calcAverageRatings = async function(tourId){
  //calling agregate to the model
 const stats = await this.aggregate([
    {
      $match:{tour: tourId}
    },
    {
      $group:{
        _id:"$tour",
        nRatings:{$num : 1},
        avgRating: {$avg: '$rating'}
      }
    }
  ]);
  console.log(stats)
  //executing code if we have a stats results
  if(stats.length > 0){
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
} else {
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: 0,
    ratingsAverage: 4.5,
  });
}
}

reviewSchema.post('save',function(){
  //
  this.constructor.calcAverageRatings(this.tour);
  //

})

//creating a middleware that will update and delete reviews

reviewSchema.pre(/^findOneAnd/,async function(next){
 const r =  await this.findOne();//this gets the docs from the DB
 console.log(r)
});
reviewSchema.post(/^findOneAnd/,async function(next){
  //using constructor to pass data from our pre middleare to our post middleware
await this.r.constructor.calcAverageRatings(this.r.tour);
})
const Review = mongoose.model('Review',reviewSchema)  

module.exports = Review;
 
//referencing our review..by implement parent referencing


//Making a request for post and tour5

//POST /tour/234fad4/reviews
