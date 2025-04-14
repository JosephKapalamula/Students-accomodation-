const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { protect, authorize } = require("../middlewares/auth");

router.route("/signup").post(userController.signUp);
router.route("/login").post(userController.logIn);
router.route("/logout").get(protect, userController.logOut);
router.route("/forgotpassword").post(protect, userController.forgotPassword);
router
  .route("/resetpassword/:token")
  .patch(protect, userController.resetPassword);
router.route("/").get(userController.getAllUsers);
router
  .route("/:userId")
  .get(protect, authorize("admin"), userController.getUser)
  .delete(protect, authorize("admin"), userController.deleteUser);

module.exports = router;    
