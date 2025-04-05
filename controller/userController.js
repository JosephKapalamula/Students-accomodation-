const User = require('../model/userModel');

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
        if (!user || !(await user.comparePassword(password))) {
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a password reset token and send it to the user's email
        // ...
        return res.status(200).json({ message: 'Password reset link sent to email' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Please provide a token and new password' });
    }
    try {
        // Verify the token and reset the password
        // ...
        return res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
} 