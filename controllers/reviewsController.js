const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");
// const catchAsync = require("./../UTILS/catchAsync");

//this will create an object and rest parameter for createing an array for all the argument passed in

// const filterObj = (obj, ...allowedFIelds) => {
//   const newObj = {};
//   //loopin thru object

//   Object.keys(obj).forEach((el) => {
//     if (allowedFIelds.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

//

//
exports.setTourUserIds = (req,res,next) => {
  //Allow nested route 
  if (!req.body.tour) req.body.tour = req.params.tourId;//setting all the ids of the body and moving it to the next middle ware.
  if (!req.body.user) req.body.user = req.user.id;
  next()
}
// //Creating a new review...

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
  //     try{

  // }catch(err){
  //     res.status(400).json({
  //         status:'Failed',
  //         message:err
  //     })
  // }


// exports.updateReview = catchAsync(async (req, res, next) => {
//   //1,Create error if User POSTS password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password update .Please use /updateMyPasword",
//         400
//       )
//     );
//   }
//   //filtering unwanted fields names that are not allowed to be updated
//   const filterBody = filterObj(req.body, "name", "email");
//   ///2,if no lets update user document..

//   const updateReview = await Review.findByIdUpdate(req.user.id, filterBody, {
//     new: true,
//     validators: true,
//   });

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updateReview,
//     },
//   });
// });


//2,user router
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)
