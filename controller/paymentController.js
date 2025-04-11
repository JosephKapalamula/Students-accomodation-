const Transaction = require("../model/transactionModel");
const Room = require("../model/roomModel");
const User = require("../model/userModel");
const axios = require("axios");
const sendMail=require("../utils/email");

exports.initialisePayment = async (req, res) => {

  const { amount,bookingId,firstName,lastName} = req.query;
  const userId = req.user._id;
  const email= req.user.email;

  if (!amount || bookingId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userEmail = req.user.email;
  const transaction = await Transaction.findById(bookingId);
  if (!transaction) {
  return res.status(404).json({ message: "Transaction not found" });
  }
  txt_ref = bookingId ;  //this good transaction refference 

  const inpuData = {
    amount: amount,
    currency: "MWK",
    callback_url: "https://0e2e-137-64-0-30.ngrok-free.app/api/v1/payment/verify-payment",
    //return url
    first_name: firstName,  //joka
    last_name: lastName,
    email: email ,             // 'jkapalamula20@gmail.com',
    tx_ref: tx_ref,
  };

  const options = {
    method: "POST",
    url: "https://api.paychangu.com/payment",
    headers: { accept: "application/json", "content-type": "application/json" ,
    Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`},
    data: inpuData,
  };

  try {
    const response = await axios.request(options);
    if (response.data.status === "success") {
       const checkout_url=response.data.data.checkout_url;
        // console.log("checkout_url", response.data);
      return res
        .status(200)
        .json({ message: "Payment initialized successfully",checkout_url});
    } 
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.verifyPayment = async (req, res) => {
  const {tx_ref} = req.query;
    if (!tx_ref) {
        return res.status(400).json({ message: "Transaction reference is required" });
    } 
    try{

        const response = await axios.get(
            `https://api.paychangu.com/verify-payment/${tx_ref}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`, 
              },
            }
          );
        
        if (response.data.data.status== "success") {

          const transaction = await Transaction.findOne({tx_ref});
          if (!transaction) {
              return res.status(404).json({ message: "Transaction not found" });
          }
          if(response.data.amount!==transaction.amount){
            return res.status(400).json({ message: "Payment amount mismatch" });
          }
        
          if (transaction.status === "completed") {
            return res.status(400).json({ message: "Transaction already completed" })
          }
          transaction.status ='completed';
          await transaction.save();
          const room = await Room.findById(transaction.room).populate("agent");
          if (!room) {
              return res.status(404).json({ message: "Room not found" });
          }
          if(room.status!='available'){
              return res.status(400).json({ message: "Room is not available" });
          }
          room.numberOfRooms -= 1;
          if(room.numberOfRooms===0){
              room.status='not available';
          }
          const agentPhoneNumbers=room.agent.phoneNumbers;
          
          room.transactions.push(transaction._id);
          await room.save();
          const user = await User.findById(transaction.user);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
          user.transaction.push(transaction._id);
          await user.save();
          const options={
              email:response.data.data.customer.email,
              subject:"Payment Successful",
              message:`Hello ${esponse.data.data.customer.first_name} ${response.data.data.customer.last_name},\n\n Your payment of ${response.data.amount} MWK was successful, here are numbers of your landloard {agentPhoneNumbers}.\n\n Thank you for your business!`
          }
          await sendMail(options);
           res.status(200).json({ message: "Payment verified successfully" });
      }
        else{
        const transaction = await Transaction.findOne({tx_ref});
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        if (transaction.status === "completed") {
          return res.status(400).json({ message: "Transaction already completed" });
        }
        transaction.status ='cancelled';
        await transaction.save();
        return res.status(400).json({ message: "Payment not verified" });
        }
        
        

    }catch(error){
        
        return res.status(500).json({ message: error.message });
    }


  
}


