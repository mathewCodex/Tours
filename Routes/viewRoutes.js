const express = require("express");
const viewsController = require("../controllers/viewsController")
const authController = require("../controllers/authController")
const router = express.Router();
///rendering our view
router.use(viewsController.alerts);
//
// router.use(authController.isLoggedIn);
// //implement route  for overview
// router.get("view",authController.isLoggedIn ,viewsController.getView
// )
router.get("/views", authController.isLoggedIn, viewsController.getOverview);
//creating a route for a specific tour
router.get("/tour/:slug",authController.isLoggedIn, viewsController.getTour);
router.get("/login",authController.isLoggedIn, viewsController.getLoginForm);

//
router.get('/me', authController.protect, viewsController.getAccount);

router.get("/my-tours", authController.protect, viewsController.getMyTours);
router.post('/submit-user-data',authController.protect, viewsController.upDateUserData)
module.exports = router; 