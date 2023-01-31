const express = require("express");
const multer = require('multer')
//defining code for our second users///////
const userController = require("./../controllers/userController");

const authController = require("./../controllers/authController");
const reviewControlletr = require("./../controllers/reviewsController")


//this process is called mounting a router..
const router = express.Router();
//authentication route handler
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout)
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//Protect all routes after this middleware
router.use(authController.protect)


router.patch(
  "/updateMyPassword",
  
  authController.updatePassword
);
//
router.get("/me", userController.getMe,userController.getUser)
// router.patch("/updateMe", authController.protect, authController.updateMe);
router.patch("/updateMe",userController.uploadUserPhoto, userController.resizeUserPhoto,userController.updateMe)
router.delete("/deleteMe", userController.deleteMe);

//retricting route for only admin
router.use(authController.restrictTo("admin"))
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUsers);
router 
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUsers)
  .delete(userController.deleteUsers);


module.exports = router;
