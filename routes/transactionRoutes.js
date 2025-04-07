const router=require('express').Router();
const transactionController=require('../controller/transactionController');


router.route('/').get(transactionController.getAllTransactions).post(transactionController.bookRoom)
router.route('/:transactionId').get(transactionController.getTransactionById)
router.route('/user/:userId').get(transactionController.getUserTransactions) 




module.exports=router;