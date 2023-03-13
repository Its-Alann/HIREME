import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FlagIcon from "@mui/icons-material/Flag";
import { IconButton, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const MessageOptions = ({ index, convoId, reportMessage }) => {
  const antinos = "🖖";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
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
          // display: "none",
          color: "white",
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* <MenuItem className="deleteMsgButton" onClick={handleClose}>
          <DeleteForeverIcon />
          Delete
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            reportMessage(index);
          }}
          className="reportMsgButton"
        >
          <FlagIcon />
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
