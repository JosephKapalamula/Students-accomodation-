const institutionController = require("../controller/institutionController");
const router = require("express").Router();
const {protect,authorize}=require('../middlewares/auth')

router.route("/").get(protect,authorize("admin"),institutionController.getAllInstitutions).post(protect,authorize("admin"),institutionController.createInstitution);
router.route("/:institutionId").get(protect,authorize("admin"),institutionController.getInstitutionById).patch(protect,authorize("admin"),institutionController.updateInstitution).delete(protect,authorize('admin'),institutionController.deleteInstitution);
router.route("/institutionRooms/:institutionId").get(protect,authorize("admin"),institutionController.getInstitutionRooms);
router.route("/institutionTransactions/:institutionId").get(protect,authorize("admin"),institutionController.getInstitutionTransactions);

module.exports = router;
