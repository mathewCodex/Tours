const multer = require("multer");
const User = require("./../models/UserModel");
const sharp = require("sharp");
const catchAsync = require("./../UTILS/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../UTILS/appError");
//creating a multer storage
// const multerStorage = multer.diskStorage({
//   //setting the the destination which is a callback function
//   destination:(req,file,cb) =>{
//     cb(null,'public/image/users')
//   },
//   //creating filename...
//   filename:(req,file,cb) => {
//     const ext =file.mimetype.split('/')[1];
//     //calling callback
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })
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
//a middle ware function
exports.uploadUserPhoto = upload.single("photo");

//resixing user photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  //setting filename
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
   await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/image/users/${req.file.filename}`);

    next()
})
//this will create an object and rest parameter for createing an array for all the argument passed in

const filterObj = (obj, ...allowedFIelds) => {
  const newObj = {};
  //loopin thru object

  Object.keys(obj).forEach((el) => {
    if (allowedFIelds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1,Create error if User POSTS password data
  // console.log(req.file)
  // console.log(req.body)
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update .Please use /updateMyPasword",
        400
      )
    );
  }
  //filtering unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(req.body, "name", "email");
  if (req.file) filterBody.photo = req.file.filename;
  ///2,if no lets update user document..

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
//delete funtion
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getUser = factory.getOne(User);
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This Route is not yet defined! Please use sign up instead",
  });
};
//do not update  password with this...
exports.getAllUsers = factory.getAll(User);
exports.updateUsers = factory.updateOne(User);
exports.deleteUsers = factory.deleteOne(User);
//2,user router
