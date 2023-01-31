const slugify = require("slugify");
const validator = require("validator");
 const User = require("./UserModel");
const mongoose = require("mongoose");
///creating a tour schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour  must have a name"],
      unique: true,
      trim: true,
      maxLength: [40, "A tour name must have less or equal than 40 characters"],
      minLength: [10, "A tour name must have more or equal than 10 characters"],
      //  validate: [validator.isAlpha,'TOur name must only contain Characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      //Note that the enum
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy ,medium , difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings must be above 1.0"],
      max: [5, "Ratings must be below 5.0"],
      //creating a setter function which will run each time for the rt value fields
      set: val => Math.round(val * 10) / 10 // 
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },  
    priceDisCount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) sholud be below the regular price",
    },
    priceDisCount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select:false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //embeding a document
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    // reviews:[
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review'
    //   }
    // ]
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
  }
);
// tourSchema.index({
//   price: 1
// })
tourSchema.index({
  price: 1,ratingsAverage: -1
});
tourSchema.index({slug:1})
tourSchema.index({startLocation: "2dsphere"})//for geospatial data it needs to be 2dsphere index which is an earth like sphere were all our data is locted
///Virtual property
tourSchema.virtual("durationWeeks").get(function () {
  //defining the duration weeks
  return this.duration / 7;
});
//virtual populate..
tourSchema.virtual('reviews', {
  ref:"Review",
  //specifying two fields..
  foreignField: "tour",
  //curent model 
  localField: "_id"
})
//defining middleware, runs before .save() and .create() command but not on .insertMany()
tourSchema.pre("save", function (next) {
  // this.find({ secretTour: {$ne: true}})
  this.slug = slugify(this.name, { lower: true });
  next();
});
//
tourSchema.pre("save", async function (next) {
  //array of all users ID
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
// //we can also have multiple pre middleware  or pre save hook
//   tourSchema.pre('save', function(next){
//     console.log('Will save docs');
//     next();
//   })
// //post middleware
// tourSchema.post('save', function(doc,next) {
//   console.log(doc);
//   next();
// })
//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  //
  this.start = Date.now();
  next();
});
//
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
}); 
//defining a post middleware for find
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took  ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);  
  next();
});
/////
// tourSchema.pre('find', function(next){
//     this.find({ secretTour: {$ne: true}})
//   next();
// })
//aggregate MIDDLEWARE
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unShift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour
