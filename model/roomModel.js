const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["single", "shared"],
      required: true,
    },
    class: {
      type: String,
      enum: ["luxurious", "affordable"],
    },
    category: {
      type: String,
      enum: ["boys", "girls", "both"],
      
    },
  },
  {
    timestamps: true,
  }
);
RoomSchema.pre("save", function (next) {
  if (this.cost < 50000) {
    this.class = "affordable";
  } else {
    this.class = "luxurious";
  }
  next();
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
