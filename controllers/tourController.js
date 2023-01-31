const multer = require('multer');
const sharp = require('sharp');
const AppError = require("../UTILS/appError");
const Tour = require("./../models/tourModel");

const catchAsync = require("./../UTILS/catchAsync");
const factory = require("./handlerFactory");






//using buffer
const multerStorage = multer.memoryStorage();
//creating a multer filter..
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not a image please upload all the images.", 400), false);
  }
};
////creating upload to de fine t"e destination" ;
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//creating midleware for uplaod and we use the field method for different images
exports.uploadTourImages = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 3}
])
//if we have multple image we could use 
// upload.array('images', 5)

exports.resizeTourImages = catchAsync (async(req,res,next)=> {
  console.log(req.files)
 if(!req.files.imageCover || !req.files.images) return next();
    //setting filename
req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
   await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/image/tour/${req.body.imageCover}`);
    //
    req.body.images = [];
    //  req.body.imageCover = imageCoverFileName;
    //2, using loop to process all the images
    await Promise.all(req.files.images.map(async (file,i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
       await sharp(file.buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/image/tour/$filename}`);

    //
     req.body.images.push(filename);
    }))
  //  console.log(body)
  next();
})
////
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";

  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
exports.getAllTours = factory.getAll(Tour);
//  }catch(err){
//     res.status(404).json({
//         status: 'fail',
//         message:err
//     })
//  }

exports.getTour = factory.getOne(Tour, { path: "reviews" });

// }catch(err){
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
// }

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);
//
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req,res,next) => {
//     //try{
//    const tour =   await Tour.findByIdAndDelete(req.params.id)

//         if (!tour) {
//           return next(new AppError("No tour Found with that ID", 404));
//         }
//          res.status(204).json({
//         status:'success',
//         data:null
//     });
// // } catch (err) {
// //     res.status(404).json({
// //       status: "Failed",
// //       message: err,
// //     });
// //   }

// })
///AGRATION PIPELINE FUNCTIONS...

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try{
  const stats = await Tour.aggregate([
    //passing in an array of stages
    //1,Match stage
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      //the group stage...
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    //   {
    //     $match: { _id: { $ne: 'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
  //   }catch(err){
  //  res.status(404).json({
  //   status: 'fail',
  //   message: err
  //  })
  //   }
});

///
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try{
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      //this deconstruct an array field of input and output one document for each element of the array...
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      //group stage..
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
  //no need of the  catch error handler because we have created a global error handler to make our code cleaner
  // }catch(err){ 
  //   res.status(404).json({
  //     status:'fail',
  //     mesage:err
  //   })
  // }
});
//
exports.getTourWithin = catchAsync(async (req, res, next) => {
  //using distructuring to get all our daata fromthe params
  const { distance, latlng, unit } = req.params;
  //creating single variable for each of them
  const [lat, lng] = latlng.split(",");
  //radius which is basically the distance

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(new AppError("Please provide in the format lat,lng", 400));
  }
  console.log(distance, lat, lng, unit);
  //using this api we find all our documents within a starting point
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
//getting distance
exports.getDistances = catchAsync(async (req, res, next) => {
  //using distructuring to get all our daata fromthe params
  const {  latlng, unit } = req.params;
  //creating single variable for each of them
  const [lat, lng] = latlng.split(",");
  //radius which is basically the distance
// creating a multiplyer variables
const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(new AppError("Please provide in the format lat,lng", 400));
  }
  //using agregation pipeline  to make calculation
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        //we only have one field so we will use our start location || we use the keys if we have more than one
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        //were all the field will be intall
        distanceField: "distance",
        distanceMultiplier: multiplier//same as dividing by 1000
      },
    },{
      $project:{
        distance:1,
        name:1
      }
    }
  ]);
  res.status(200).json({
    status: "success",

    data: {
      data: distances,
    },
  });
});
