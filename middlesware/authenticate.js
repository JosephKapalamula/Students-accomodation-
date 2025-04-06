const jwt = require("jsonwebtoken");



exports.protect = async (req, res, next) => {
    try {
      // checking if the token is in the header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res.status(401).json({
          message: "No token provided",
        });
  
      // Verifying token from user
      const decoded = promisify(jwt.verify(token, process.env.JWT_SECRET));
  
      // Find the user and check if they still exist
      const currentUser = await User.findById(decoded.id);
      if (!currentUser)
        return res.status(401).json({
          message: "User not found",
        });
  
      // Grant access if no
      req.user = currentUser;
      next();
    } catch (error) {
      res.status(401).json({
        message: "Authentication failed",
        error: error.message,
      });
    }
  };
  
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }
      next();
    };
  }
    