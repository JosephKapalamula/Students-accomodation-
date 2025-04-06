const User = require('../model/userModel');
const sendEmail = require('../utils/email');
const crypto = require('crypto');


exports.signUp = async (req, res) => {
    const { userName, email, password ,institution,role} = req.body;
    if (!userName || !email || !password || !institution || !role) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    try {
        const user = await User.create({ userName, email, password, institution, role });
        const token=user.generateToken();
        return res.status(201).json({ message: 'User created successfully',user,token: token });

    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: error.message });
    }
    
}


exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    try{
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = user.generateToken();
    
        return res.status(200).json({ message: 'User logged in successfully', token });

    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        return res.status(200).json({ message: 'All users fetched successfully', users });

    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.logOut = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.getUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Please provide a user ID' });
    }
    try{
        const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User fetched successfully', user });
    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Please provide a user ID' });
    }
    try{
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });

    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please provide an email' });
    }
    try {
        const user = await User.findOne({ email }).select('email');
        if (!user) {
            return res.status(200).json({ message: 'Reset email has been sent to your email' }); // to prevent attackers
        }
        const resetToken = user.createResetToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetToken}`;
        const message=`we have recieved your password reset request please use this link to reset your password\n\n ${resetUrl}\n\n this reset link will be valid for 10 minutes only`
        try{
            await sendEmail({
                email: user.email,
                subject: 'Reser Password',
                message: message,
            });

            return res.status(200).json({ message: 'Password reset link sent to email' });
    
        }catch(error){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: error.message });

        }
        

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Please  provide new password' });
    }
    try {
        const user= await User.findOne({
            resetPasswordToken: crypto.createHash('sha256').update(token).digest('hex'),
            resetPasswordExpire: { $gt: Date.now() },
        });
         
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        const loginToken = user.generateToken();
        return res.status(200).json({ message: 'Password reset successfully', token: loginToken });


        

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
} 