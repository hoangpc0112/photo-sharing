import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ photoUploadTrigger }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});

  const fetchPhotos = async () => {
    const data = await fetchModel("/photo/user/" + userId);
    setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
  }, [userId, photoUploadTrigger]);

  const handleCommentChange = (photoId, text) => {
    setCommentTexts({
      ...commentTexts,
      [photoId]: text,
    });
  };

  const handleCommentSubmit = async (photoId) => {
    const commentText = commentTexts[photoId];
    if (!commentText || commentText.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: commentText }),
        }
      );

      if (response.status === 200) {
        // Clear the comment input
        setCommentTexts({
          ...commentTexts,
          [photoId]: "",
        });

        // Refresh photos to show new comment
        fetchPhotos();
      } else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  return (
    <div>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: "20px" }}>
          <CardMedia
            src={`http://localhost:8081/images/${photo.file_name}`}
            component="img"
            height="400"
            alt={`Photo ${photo._id}`}
          />
          <CardContent>
            <Typography variant="caption" display="block" gutterBottom>
              Posted on: {new Date(photo.date_time).toLocaleString()} {/*  */}
            </Typography>

            <Typography variant="h6">Comments:</Typography>
            <List dense>
              {photo.comments?.map((comment) => (
                <React.Fragment key={comment._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      secondary={
                        <>
                          <Typography
                            component={Link}
                            to={`/users/${comment.user._id}`}
                            color="primary"
                            style={{ textDecoration: "none" }}
                          >
                            {`${comment.user.first_name} ${comment.user.last_name}`}
                          </Typography>
                          {` - ${new Date(comment.date_time).toLocaleString()}`}{" "}
                        </>
                      }
                    />
                    {comment.comment}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>

            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Add a comment:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Write a comment..."
                value={commentTexts[photo._id] || ""}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                multiline
                rows={2}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommentSubmit(photo._id)}
                style={{ marginTop: "10px" }}
              >
                Post Comment
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
