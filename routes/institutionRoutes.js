const institutionController = require("../controller/institutionController");
const router = require("express").Router();

router
  .route("/")
  .get(institutionController.getAllInstitutions)
  .post(institutionController.createInstitution);
router
  .route("/:id")
  .get(institutionController.getInstitutionById)
  .patch(institutionController.updateInstitution)
  .delete(institutionController.deleteInstitution);
router
  .route("/institutionRooms/:institutionId")
  .get(institutionController.getInstitutionRooms);
router
  .route("/institutionTransactions/:institutionId")
  .get(institutionController.getInstitutionTransactions);

module.exports = router;
