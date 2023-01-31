const express = require("express");
//defining code for our second users///////
const reviewController = require("./../controllers/reviewsController");
const authController = require("./../controllers/authController");
//this process is called mounting a router..
const router = express.Router({ mergeParams: true });
//authentication route handler

router.use(authController.protect)
router
  .route("/reviews")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

//
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );
// router
//   .route("/:id")
//   .get(reviewController.getReview)

module.exports = router;
