const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const crypto = require('crypto');
const Institution=require('./institutionModel');


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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
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
    },
    phoneNumberS:{
        type: [String],
        validate: {
            validator: function (value) {
              // Require at least one phone number if role is 'admin' or 'agent'
              if (this.role === 'agent') {
                return Array.isArray(value) && value.length > 0;
              }
              return true; // Don't require for regular users
            },
            message: 'At least one phone number is required for admin or agent.',
          }
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: function () {
          return this.role === 'agent';
        },
        select: false,
      },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
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
