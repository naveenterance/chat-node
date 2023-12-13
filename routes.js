const express = require("express");
const User = require("./user");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Create a new user
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/", (req, res) => {
  res.send("it's working ");
});

// Update a user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    } else {
      const token = jwt.sign({ name: user.name }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/users/:name", async (req, res) => {
  const { name } = req.params;

  try {
    console.log("Searching for user with name:", name);
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ exists: false });
    }

    res.json({ exists: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
