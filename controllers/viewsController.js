const Tour = require("../models/tourModel");
const catchAsync = require("../UTILS/catchAsync");
const Booking = require("../models/bookingModel");
const User = require('../models/UserModel');
const AppError = require("../UTILS/appError");
// exports.getOverView = catchAsync(async (req, res,next) => {
//   //getting tour data from collection
//   const tours = await Tour.find();

//   //Building templates

//   //adn rendering templates
//   res.status(200).render("view", {
//     title: "All tours",
//     //passing in some data
//     tours,
//   });
// });
//Booking message...
exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking")
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};
//
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});


exports.getTour = catchAsync(async (req, res,next) => {
  //getting tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review ratings user",
  });
//
if(!tour){
  return next(new AppError("Theres's no tour with that name", 404))
}
  res
    .status(200)
    // .set(
    //   "Content-Security-Policy",
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .set(
      "Content-Security-Policy",
      "connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render("tour", {
      //passing in some data
      title: `${tour.name} Tour`,
      tour,
    });
});
// 
exports.getLoginForm = catchAsync(async (req, res) => {
  //getting tour data from collection
  // const tours = await Tour.find();

  //Building templates

  //adn rendering templates
  res.status(200).render("login", {
    title: "Login page"
    //passing in some data
  });
});



exports.getAccount = (req,res) => {
  res.status(200).render("account",{
    title:"Your account"
  })
}
//////

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.upDateUserData = catchAsync( async (req,res,next) => {
   console.log(('UPDATE USER', req.body))

   const updatedUser  = await User.findByIdAndUpdate(req.user.id,{
    name: req.body.name,
    email: req.body.email
   },{
     new: true,
     runValidators: true
   });
   //rendering the account page again
   res.status(200).render('account', {
    title: "Your account",
    user: updatedUser
   })
});