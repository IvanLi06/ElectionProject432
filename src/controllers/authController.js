const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserType } = require('../models');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate a JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, userTypeID: user.userTypeID },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    const userType = await UserType.findByPk(user.userTypeID); 
    const { password: pwd, ...userWithoutPassword } = user.get({ plain: true });
    return res.json({
        message: 'Login successful',
        token,
        user: {
          ...userWithoutPassword,
          userType: userType ? userType.description : null, // Include the user type
        },
    });

  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message });
  }
};
