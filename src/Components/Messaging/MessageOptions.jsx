import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const MessageOptions = ({ index, convoId, reportMessage }) => {
  const antinos = "🖖";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    console.log(e.currentTarget);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        className="messageOptions"
        size="small"
        disableRipple
        onClick={handleClick}
        sx={{
          height: "fit-content",
          alignSelf: "center",
          p: 0,
          display: "none",
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem
          onClick={() => {
            reportMessage(index);
          }}
        >
          Report
        </MenuItem>
      </Menu>
    </>
  );
};

MessageOptions.propTypes = {
  index: PropTypes.number,
  convoId: PropTypes.string,
  reportMessage: PropTypes.func,
};

export default MessageOptions;
