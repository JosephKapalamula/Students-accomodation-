const router = require('express').Router();
const roomController = require('../controller/roomController');
const {protect,authorize}=require('../middlewares/auth');


router.route('/').get(protect,authorize('admin'),roomController.getAllRooms)
router.route('/createRoom/:agentId').post(protect,authorize('agent'),roomController.createRoom);
router.route('/search').get(protect,roomController.searchRooms);
router.route('/bookedRooms/:InstitionId').get(protect,authorize('admin'),roomController.getBookedRoomsForSpecificUniversity)
router.route('/bookedRooms').get(protect,authorize('admin'),roomController.getBookedRoomsForAllUniversities)
router.route('/availableRoomsFor1').get(protect,authorize('admin'),roomController.getAvailableRoomsForSpecificUniversity)
router.route('/availableRoomsForAll').get(protect,authorize('admin'),roomController.getAvailableRoomsForAllUniversities)
router.route('/:roomId').get(protect,authorize('admin'),roomController.getRoomById).patch(protect,authorize('admin','agent'),roomController.updateRoom).delete(protect,authorize('admin'),roomController.deleteRoom);


module.exports = router;        