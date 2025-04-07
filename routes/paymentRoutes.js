const paymentController = require('../controller/paymentController');
const router = require('express').Router();



router.route('/initiate-payment').post(paymentController.initialisePayment);
router.route('/verify-payment').get(paymentController.verifyPayment);
// router.route('/return').post(paymentController.returnPayment);








module.exports = router;