const router=require('express').Router();
const transactionController=require('../controller/transactionController');
const {protect,authorize}=require('../middlewares/auth');


router.route('/').get(protect,authorize('admin'),transactionController.getAllTransactions).post(protect,transactionController.bookRoom)//booking room
router.route('/:transactionId').get(protect,authorize('admin'),transactionController.getTransactionById)
router.route('/user/:userId').get(protect,authorize('admin'),transactionController.getUserTransactions) 




module.exports=router;