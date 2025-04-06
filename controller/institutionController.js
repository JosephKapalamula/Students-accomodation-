const Institution=require('../model/institutionModel');



exports.createInstitution = async (req, res) => {
    const { name } = req.body;
    try {
        const institution = await  Institution.create({ name });
        if (!institution) {
            return res.status(400).json({ message: 'Error creating institution' });
        }

        res.status(201).json({ message: 'Institution created successfully', institution });
    } catch (error) {
        res.status(400).json({ message: 'Error creating institution', error });
    }
}
exports.getAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find();
        if (!institutions) {
            return res.status(404).json({ message: 'No institutions found' });
        }
        if (institutions.length === 0) {
            return res.status(404).json({ message: 'No institutions found' });
        }

        res.status(200).json({ message: 'Institutions retrieved successfully', institutions });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving institutions', error });
    }
}

exports.getInstitutionById = async (req, res) => {
    const { id } = req.params;
    try {
        const institution = await Institution.findById(id);
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        res.status(200).json({ message: 'Institution retrieved successfully', institution });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving institution', error });
    }
}

exports.updateInstitution = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try{
        const institution= await Institution.findByIdAndUpdate(id, { name }, { new: true });
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }
        res.status(200).json({ message: 'Institution updated successfully', institution });

    }catch (error) {
        res.status(400).json({ message: 'Error updating institution', error });
    }
}

exports.deleteInstitution = async (req, res) => {
    const { id } = req.params;
    try {
        const institution = await Institution.findByIdAndDelete(id);
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        res.status(200).json({ message: 'Institution deleted successfully', institution });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting institution', error });
    }
}
exports.getInstitutionRooms = async (req, res) => {
    const { institutionId } = req.params;
    try {
        const institution = await Institution.findById(institutionId).populate('rooms');
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        res.status(200).json({ message: 'Institution rooms retrieved successfully', rooms: institution.rooms });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving institution rooms', error });
    }
}
exports.getInstitutionTransactions = async (req, res) => {
    const { institutionId } = req.params;
    try {
        const institution = await Institution.findById(institutionId).populate('transactions');
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        res.status(200).json({ message: 'Institution transactions retrieved successfully', transactions: institution.transactions });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving institution transactions', error });
    }
}   