const adminController=require('../controller/adminController')
const router = require('express').Router();
const {protect,authorize}=require('../middlewares/auth')

router.route('/').get(protect,authorize('admin','user'),adminController.getAllunverifiedAgents)   // getting all agent to verify them
router.route('/verify-agent/:id').patch(protect,authorize('admin'),adminController.verifyAgent) // verify agent


module.exports=router