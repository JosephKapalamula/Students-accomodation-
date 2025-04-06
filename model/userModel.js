const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const crypto = require('crypto');


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
    resetPasswordToken:{
        type: String,
        select: false,
    },
    resetPasswordExpire: {
        type: Date,
        select: false,
    }

}, { timestamps: true }
); 

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
UserSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


const User = mongoose.model('User', UserSchema);
module.exports = User;
