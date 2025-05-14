const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust the path as needed

module.exports = async function (req, res, next) {
  try {
    const token = req.header('token');

    if (!token) {
      return res.status(401).json({ error: 'Token header missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Authorization failed' });
    }

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Server error during authorization' });
  }
};
