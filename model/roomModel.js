const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  agentFee: {
    type: Number,
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  distance: {
    type: Number,
    required: true,
  },
  status:{
    type: String,
    enum: ["available", "not available"],
    default: "available",
  },
  numberOfRooms: {  
    type: Number,
    required: true,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  isVerified:{
    type: Boolean,
    default: false,
    select: false,
  }

},
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
