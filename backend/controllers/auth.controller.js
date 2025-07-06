const Project = require('../models/project.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.userId = user._id;
    req.session.role = user.role;
    console.log('Session after login:', req.session);

    res.json({ message: 'Login successful', user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.userId; // assume this comes from auth middleware
    const project = new Project({
      name,
      createdBy: userId,
      members: [{ user: userId, role: 'admin' }]
    });
    await project.save();
    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.getUsers = async (req, res) => {
//   // Ensure the user is authenticated
//   // if (!req.session.userId) {
//   //   return res.status(401).json({ message: 'Unauthorized' });
//   // }

//   try {
//     const users = await User.find({}, 'username email role');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateRole = async (req, res) => {
//   try {
//     const { userId, role } = req.body;
//     await User.findByIdAndUpdate(userId, { role });
//     res.json({ message: 'User role updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
