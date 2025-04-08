const User=require('../model/userModel')
const Transaction = require('../model/transactionModel')
const Room = require('../model/roomModel')
const sendEmail = require('../utils/email')

exports.getAllunverifiedAgents = async (req, res) => {
    try {
        const unverifiedAgents = await User.find({ role: 'agent', isVerified: false });
        if (!unverifiedAgents) {
            return res.status(404).json({ message: "No unverified agents found" });
        }
        if (unverifiedAgents.length === 0) {
            return res.status(404).json({ message: "No unverified agents found" });
        }
        res.status(200).json({ message: "Unverified agents retrieved successfully", unverifiedAgents });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.verifyAgent = async (req, res) => {
    const { id } = req.params;
    
    try {
        const agent = await User.findById(id).select('+isVerified');
    
        if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
        }

        if (agent.role !== 'agent') {
        return res.status(400).json({ message: 'This user is not an agent' });
        }
    
        agent.isVerified = true;
        await agent.save();
        // Send email to agent
        const options={
            to: agent.email,
            subject: 'Agent Verification Successful',
            message: `Dear ${agent.name},\n\nYour account has been successfully verified.\n\nThank you,\nAdmin`,
        }
        await sendEmail(options);
        res.status(200).json({ message: "Agent verified successfully", agent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.verifyRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findById(id).select('+isVerified');
    
        if (!room) {
        return res.status(404).json({ message: "Room not found" });
        }
        if( room.isVerified) {
            return res.status(400).json({ message: 'Room is already verified' });
        }
        if (room.status !== 'available') {
            return res.status(400).json({ message: 'This room is not available' });
        }
        room.isVerified = true;
        await room.save();
        // Send email to agent
        const options={
            to: room.agent.email,
            subject: 'Room Verification Successful',
            message: `Dear ${room.agent.name},\n\nYour hostels has been successfully verified.\n\nThank you,\nAdmin`,
        }
        await sendEmail(options);
        res.status(200).json({ message: "Room verified successfully", room });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.getAllUnverifiedRooms = async (req, res) => {
    try {
        const unverifiedRooms = await Room.find({ isVerified: false });
        if (!unverifiedRooms) {
            return res.status(404).json({ message: "No unverified rooms found" });
        }
        if (unverifiedRooms.length === 0) {
            return res.status(404).json({ message: "No unverified rooms found" });
        }
        res.status(200).json({ message: "Unverified rooms retrieved successfully", unverifiedRooms });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
