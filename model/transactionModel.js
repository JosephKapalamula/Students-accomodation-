const mongoose = require('mongoose');
const Instituion = require('./institutionModel'); // to keep track of all transaction for specific university

const TransactionSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
    },
})


const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;