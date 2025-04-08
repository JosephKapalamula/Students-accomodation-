const adminController=require('../controller/adminController')
const router = require('express').Router();
const {protect,authorize}=require('../middlewares/auth')

router.route('/').get(protect,authorize('admin','user'),adminController.getAllunverifiedAgents)   // getting all agent to verify them
router.route('/verify-agent/:id').patch(protect,authorize('admin'),adminController.verifyAgent) // verify agent
router.route('/verify-room/:id').patch(protect,authorize('admin'),adminController.verifyRoom) // verify room
router.route('/get-unverified-rooms').get(protect,authorize('admin'),adminController.getAllUnverifiedRooms) // getting all unverified rooms

module.exports=router