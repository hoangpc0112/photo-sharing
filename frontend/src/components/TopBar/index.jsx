import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [contextMessage, setContextMessage] = useState("Photo Sharing");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDetailMatch = pathname.match(/\/users\/([^/]+)/);
      const userPhotosMatch = pathname.match(/\/photos\/([^/]+)/);

      let userId;
      if (userDetailMatch) {
        userId = userDetailMatch[1];
        const user = await fetchModel(`/user/${userId}`);
        if (user) {
          setContextMessage(`${user.first_name} ${user.last_name}`);
        }
      } else if (userPhotosMatch) {
        userId = userPhotosMatch[1];
        const user = await fetchModel(`/user/${userId}`);
        if (user) {
          setContextMessage(`Photos of ${user.first_name} ${user.last_name}`);
        }
      } else {
        setContextMessage("Photo Sharing");
      }
    };

    fetchUserData();
  }, [pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          B22DCAT128
        </Typography>
        <Typography variant="h5" color="inherit">
          {contextMessage}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
