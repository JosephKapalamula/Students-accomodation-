const paymentController = require('../controller/paymentController');
const router = require('express').Router();
const {protect,authorize}=require('../middlewares/auth')


router.route('/initiate-payment').post(protect,paymentController.initialisePayment);
router.route('/verify-payment').get(paymentController.verifyPayment);

module.exports = router;