const Room = require("../model/roomModel");

exports.createRoom = async (req, res) => {
  const { location, cost, agentFee, agent, institution, photos, distance } =
    req.body;

  if (
    !location ||
    !cost ||
    !agentFee ||
    !agent ||
    !institution ||
    !photos ||
    !distance
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (photos.length > 5) {
    return res.status(400).json({ message: "Maxmum number of photos in 5" });
  }

  try {
    const room = await Room.create({
      location,
      cost,
      agentFee,
      agent,
      institution,
      photos,
      distance,
    });
    if (!room) {
      return res.status(400).json({ message: "Error creating room" });
    }

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(400).json({ message: "Error creating room", error });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms) {
      return res.status(404).json({ message: "No rooms found" });
    }
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    res.status(200).json({ message: "Rooms retrieved successfully", rooms });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving rooms", error });
  }
}

exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try{
    const room= await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room retrieved successfully", room });

  }catch(error) {
    res.status(400).json({ message: "Error retrieving room", error });
  }
}

exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { location, cost, agentFee, agent, institution, photos, distance } =
    req.body;

  if(
    !location ||
    !cost ||
    !agentFee ||
    !agent ||
    !institution ||
    !photos ||
    !distance
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (photos.length > 5) {
    return res.status(400).json({ message: "Maxmum number of photos in 5" });
  }
  try{
    const room= await Room.findByIdAndUpdate(id, {
      location,
      cost,
      agentFee,
      agent,
      institution,
      photos,
      distance
    }, { new: true });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room updated successfully", room });
}catch(error) {
  res.status(400).json({ message: "Error updating room", error });
}
}

exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully", room });
  } catch (error) {
    res.status(400).json({ message: "Error deleting room", error });
  }
}

exports.searchRooms = async (req, res) => {
  const {  cost ,institution } =req.query;

  try {
    const rooms = await Room.find({cost,institution});
    if (!rooms) {
      return res.status(404).json({ message: "No rooms found" });
    }
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    res.status(200).json({ message: "Rooms retrieved successfully", rooms });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving rooms", error });
  }
}

exports.getBookedRoomsForSpecificUniversity= async (req, res) => {
  const { institutionId } = req.params;
  try {
    const rooms = await Room.find({ institution: institutionId, status: "not available" });
    if (!rooms) {
      return res.status(404).json({ message: "No booked rooms found" });
    }
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No booked rooms found" });
    }

    res.status(200).json({ message: "Booked rooms retrieved successfully", rooms });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving booked rooms", error });
  }
}
exports.getBookedRoomsForAllUniversities = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "not available" });
    if (!rooms) {
      return res.status(404).json({ message: "No booked rooms found" });
    }
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No booked rooms found" });
    }

    res.status(200).json({ message: "Booked rooms retrieved successfully", rooms });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving booked rooms", error });
  }
}
exports.getAvailableRoomsForSpecificUniversity = async (req, res) => {
  const { institutionId } = req.params;
  try {
    const rooms = await Room.find({ institution: institutionId, status: "available" });
    if (!rooms) {
      return res.status(404).json({ message: "No available rooms found" });
    }
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No available rooms found" });
    }

    res.status(200).json({ message: "Available rooms retrieved successfully", rooms });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving available rooms", error });
  }
}
exports.getAvailableRoomsForAllUniversities = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "available" });
    if (!rooms) {
      return res.status(404).json({ message: "No available rooms found" });
    }
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No available rooms found" });
    }

    res.status(200).json({ message: "Available rooms retrieved successfully", rooms });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving available rooms", error });
  }
}