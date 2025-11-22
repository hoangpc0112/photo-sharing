const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// GET /user/list - Return list of users for navigation sidebar
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}).select("_id first_name last_name").exec();
    response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// GET /user/:id - Return detailed information of a specific user
router.get("/:id", async (request, response) => {
  const userId = request.params.id;
  // console.log(userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      response.status(400).json({ error: "User not found" });
      return;
    }

    response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    response.status(400).json({ error: "Invalid user ID" });
  }
});

router.post("/", async (request, response) => {});

module.exports = router;
