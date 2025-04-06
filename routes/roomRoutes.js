const router = require('express').Router();
const roomController = require('../controller/roomController'); 


router.route('/').get(roomController.getAllRooms).post(roomController.createRoom);
router.route('/:id').get(roomController.getRoomById).patch(roomController.updateRoom).delete(roomController.deleteRoom);
router.route('/search').get(roomController.searchRooms);
router.route('/bookedRooms/:InstitionId').get(roomController.getBookedRoomsForSpecificUniversity)
router.route('/bookedRooms').get(roomController.getBookedRoomsForAllUniversities)
router.route('/availableRooms/:institutionId').get(roomController.getAvailableRoomsForSpecificUniversity)
router.route('/availableRooms').get(roomController.getAvailableRoomsForAllUniversities)


module.exports = router; 