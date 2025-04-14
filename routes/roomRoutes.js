const router = require('express').Router();
const roomController = require('../controller/roomController');
const {protect,authorize}=require('../middlewares/auth');
const {uploadMiddleware,upload}=require('../middlewares/multer');


router.route('/').get(protect,authorize('admin'),roomController.getAllRooms)
router.route('/createRoom').post(protect,authorize('agent'),uploadMiddleware,upload,roomController.createRoom);// note to upload yu need agentId
router.route('/search').get(protect,roomController.searchRooms);
router.route('/bookedRooms/:InstitionId').get(protect,authorize('admin'),roomController.getBookedRoomsForSpecificUniversity)
router.route('/bookedRooms').get(protect,authorize('admin'),roomController.getBookedRoomsForAllUniversities)
router.route('/agentRooms').get(protect,authorize('agent'),roomController.getAgentRooms);
router.route('/availableRoomsFor1').get(protect,authorize('admin'),roomController.getAvailableRoomsForSpecificUniversity)
router.route('/availableRoomsForAll').get(protect,authorize('admin'),roomController.getAvailableRoomsForAllUniversities)
router.route('/:roomId').get(protect,authorize('admin'),roomController.getRoomById).patch(protect,authorize('admin','agent'),roomController.updateRoom).delete(protect,authorize('admin'),roomController.deleteRoom);


module.exports = router;                