const Room = require("../model/roomModel");
const User = require("../model/userModel");
const Institution = require("../model/institutionModel");

exports.createRoom = async (req, res) => {
  const { location, cost, agentFee, photos, distance ,numberOfRooms} =
    req.body;

  const {agentId}=req.params
  
  if (!location ||!cost ||!agentFee ||!agentId ||!photos ||!distance || !numberOfRooms) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (photos.length > 5) {
    return res.status(400).json({ message: "Maxmum number of photos in 5" });
  }

  
  try {

      const agentdata = await User.findById(agentId).select("role").select("institution");
      if (!agentdata) {
        return res.status(404).json({ message: "Agent not found" });
      }
      if (agentdata.role !== "agent") {
        return res.status(400).json({ message: "you are not eligible to post hostels" });
      }
      if (!agentdata.institution) { 
        return res.status(400).json({ message: "Agent does not belong to any institution" });
      }
    const institutionData = await Institution.findOne({name:agentdata.institution});
    if (!institutionData) {
      return res.status(404).json({ message: "Institution not found" });
    }
   
    const institution = institutionData._id;
    const agent = agentdata._id
    const room = await Room.create({
      location,
      cost,
      agentFee,
      agent,
      institution,
      photos,
      numberOfRooms,
      distance,
    });
    if (!room) {
      return res.status(400).json({ message: "Error creating room" });
    }

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  const { location, cost, agentFee,numberOfRooms, photos, distance } =
    req.body;
   //patch
   if (!location && !cost && !agentFee && !photos && !distance && !numberOfRooms) {
    return res.status(400).json({ message: "At least one field is required" });
  }
  if (photos.length > 5) {
    return res.status(400).json({ message: "Maxmum number of hostel photos to upload is 5" });
  }
  try{
    const room= await Room.findByIdAndUpdate(id, {
      location,
      cost,
      agentFee,
      photos,
      distance,
      numberOfRooms
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

  const searchingCreteria = {
    status: 'available',};

  if (cost) {
    if (isNaN(cost)) {
      return res.status(400).json({ message: "Cost must be a number" });
    }
    const constNumber=Number(cost)
    searchingCreteria.cost = { $gte: constNumber - 5000, $lte: constNumber + 20000 };
    }

  
  try {
    if (!institution) {
        return res.status(404).json({ message: "Institution not provided" });
      }

    
    const institutionData = await Institution.findOne({ name: institution })
    if (!institutionData) {
      return res.status(404).json({ message: "Institution not found" });
    }
    searchingCreteria.institution = institutionData._id;
    console.log(searchingCreteria);
    const rooms = await Room.find(searchingCreteria);
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
  const { institution } = req.query;
  try {
    const institutionData = await Institution.findOne({ name: institution })
    if (!institutionData) {
      return res.status(404).json({ message: "Institution not found" });
    }
    const institutionId = institutionData._id;
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