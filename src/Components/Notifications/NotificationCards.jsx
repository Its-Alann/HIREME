import { React, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { Grid, Menu, MenuItem, Button, Card } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { NavLink } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import "./Notifications.css";


const NotificationCards = ({notifications, setNotifications, setNumOfNotifications, cardNum, currentUserEmail}) => {
 
 // Consts for menu
 const [anchorEl, setAnchorEl] = useState(null);
 const open = Boolean(anchorEl);
 const handleClick = (event) => {
   setAnchorEl(event.currentTarget);
 };
 const handleClose = () => {
   setAnchorEl(null);
 };

  // Delete notification item in array
  const deleteIndexNotification = async () => {
    const notificationRef = doc(db, "notifications", currentUserEmail);
    var array = notifications;
    array.splice(cardNum, 1);
    setNotifications(cardNum);
    setNumOfNotifications(notifications.length)
    try{
      await updateDoc(notificationRef, {
        notifications,
      })
    } 
    catch (error) {
      console.log(error);
    }
    handleClose();
    window.location.reload();
  }

  return(
    <Card className="notificationCards" variant="outlined" sx={{width: `100%`}}>
      <Grid container justifyContent="space-between">
          <NavLink id="nav_link" to={notifications[cardNum].type === "connections" ? "/network" : 
          notifications[cardNum].type === "jobs" ? `/${notifications[cardNum].link}`: 
          notifications[cardNum].type === "job alert" ? `/viewMyApplications` : 
          ""}
           style={{textDecoration: "none"}}>
          <Grid item xs={12} style={{marginLeft: 15}}>
              <h4>{notifications[cardNum].content}</h4>
          </Grid>
          <Grid item xs={10} style={{marginLeft: 15}}>
              <h4>
              Timestamp:{" "}
              {new Date(
                  notifications[cardNum].timestamp.seconds * 1000 +
                  notifications[cardNum].timestamp.nanoseconds / 1000000
              ).toLocaleDateString()}
              </h4>
          </Grid>
          </NavLink>
          <Grid item xs={0} >
          <Button
              aria-controls={open ? "basic menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
          >
              <MoreHorizIcon />
          </Button>
          <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
              <MenuItem onClick={deleteIndexNotification}>
              <DeleteOutlineIcon /> Delete this notification
              </MenuItem>
          </Menu>
          </Grid>
      </Grid>
    </Card>
  )
};

NotificationCards.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    notifications: PropTypes.array,
    setNotifications: PropTypes.func,
    setNumOfNotifications: PropTypes.func,
    currentUserEmail: PropTypes.string,
};

export default NotificationCards;
