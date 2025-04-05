const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");


const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        select: false,
        validate: {
            validator:validator.isEmail,
            message: 'Invalid email format',
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
    },
    institution: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin','agent','user'],
        default: 'user',
    },
}, { timestamps: true }); 

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


const User = mongoose.model('User', UserSchema);
module.exports = User;
