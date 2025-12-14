var express = require("express");
var router = express.Router();
var userModel = require('../model/user');

// POST: Signup - Create new user
router.post("/", async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ ename: req.body.ename });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Create and save new user
    const newUser = new userModel(req.body);
    await newUser.save();
    
    res.status(201).send({ 
      message: "User added successfully",
      user: {
        id: newUser._id,
        ename: newUser.ename,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

// POST: Login
router.post('/login', async (req, res) => {
  try {
    const { ename, password } = req.body;

    // Validate input
    if (!ename || !password) {
      return res.status(400).send({ message: "Email and password are required" });
    }

    // Find user
    const user = await userModel.findOne({ ename: ename });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check password
    if (user.password === password) {
      return res.status(200).send({ 
        message: `Welcome ${user.role}`,
        user: {
          id: user._id,
          ename: user.ename,
          role: user.role,
          name: user.name
        }
      });
    }
    
    return res.status(401).send({ message: "Invalid password" });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

// GET: Fetch all users (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await userModel.find().select('-password'); // Exclude password from response
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// GET: Fetch single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// PUT: Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Don't allow password updates through this route
    delete updateData.password;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'User updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE: Delete user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: {
        id: deletedUser._id,
        ename: deletedUser.ename
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// PATCH: Change password
router.patch('/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

module.exports = router;