const Transaction = require("../model/transactionModel");
const Room = require("../model/roomModel");
const User = require("../model/userModel");

exports.bookRoom = async (req, res) => {
  const { roomId } = req.params;
  const userId= req.user._id;
  const institutionId = req.user.institution;  //will updated so that user can book room in any institution

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room.status !== "available") {
      return res.status(400).json({ message: "Room is not available" });
    }


    const transaction = await Transaction.create({
      room: room._id,
      user: userId,
      institution: institutionId,
    });

    if (!transaction) {
      return res
        .status(400)
        .json({ message: "Error creating booking a room try again later" });
    }
    res.status(201).json({ message: "Room booked successfully", transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("room")
      .populate("user");
    if (!transactions) {
      return res.status(404).json({ message: "No transactions found" });
    }
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res
      .status(200)
      .json({ message: "Transactions retrieved successfully", transactions });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving transactions", error });
  }
};
exports.getTransactionById = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById(id)
      .populate("room")
      .populate("user");
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res
      .status(200)
      .json({ message: "Transaction retrieved successfully", transaction });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving transaction", error });
  }
};
exports.getUserTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await Transaction.find({ user: userId })
      .populate("room")
      .populate("user");
    if (!transactions) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }

    res.status(200).json({
      message: "User transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error retrieving user transactions", error });
  }
};
