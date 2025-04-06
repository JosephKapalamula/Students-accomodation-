const router = require('express').Router();
const roomController = require('../controller/roomController'); 


router.route('/').get(roomController.getAllRooms)
router.route('/createRoom/:agentId').post(roomController.createRoom);
router.route('/search').get(roomController.searchRooms);
router.route('/bookedRooms/:InstitionId').get(roomController.getBookedRoomsForSpecificUniversity)
router.route('/bookedRooms').get(roomController.getBookedRoomsForAllUniversities)
router.route('/availableRoomsFor1').get(roomController.getAvailableRoomsForSpecificUniversity)
router.route('/availableRoomsForAll').get(roomController.getAvailableRoomsForAllUniversities)
router.route('/:id').get(roomController.getRoomById).patch(roomController.updateRoom).delete(roomController.deleteRoom);


module.exports = router; 