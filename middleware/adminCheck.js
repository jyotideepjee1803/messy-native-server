const {User} = require('../Models/user');
const AppError = require('../utils/AppError');

const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user; // Assuming `verifyJWT` attaches user info to `req.user`.

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, "User not found", 404);
    }

    if (!user.isAdmin) {
      throw new AppError(403, "Access denied. User does not have admin privileges.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAdmin
