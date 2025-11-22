const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

// GET /photosOfUser/:id - Return photos of a specific user with comments
router.get("/user/:id", async (request, response) => {
  const userId = request.params.id;
  console.log(userId);

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      response.status(400).json({ error: "User not found" });
      return;
    }

    const photos = await Photo.find({ user_id: userId })
      .select("_id user_id comments file_name date_time")
      .exec();

    const processedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const photoObj = photo.toObject();

        if (photoObj.comments && photoObj.comments.length > 0) {
          photoObj.comments = await Promise.all(
            photoObj.comments.map(async (comment) => {
              const commentUser = await User.findById(comment.user_id)
                .select("_id first_name last_name")
                .exec();

              return {
                _id: comment._id,
                comment: comment.comment,
                date_time: comment.date_time,
                user: commentUser ? commentUser.toObject() : null,
              };
            })
          );
        }

        return photoObj;
      })
    );

    response.status(200).json(processedPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    response.status(400).json({ error: "Invalid user ID" });
  }
});

router.post("/", async (request, response) => {});

module.exports = router;
