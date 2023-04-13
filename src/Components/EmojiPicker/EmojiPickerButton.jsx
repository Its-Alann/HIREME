import { IconButton, Popover } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import PropTypes from "prop-types";
import React, { useState } from "react";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";

const EmojiPickerButton = ({ setShowPicker, setMessageContent }) => {
  //code for select emoji

  const onEmojiClick = (emojiData, event) => {
    setMessageContent((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //end
  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        variant="contained"
      >
        <SentimentSatisfiedOutlinedIcon color="primary" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <EmojiPicker
          pickerStyle={{ width: "100%" }}
          onEmojiClick={onEmojiClick}
        />
      </Popover>
    </>
  );
};

export default EmojiPickerButton;

EmojiPickerButton.propTypes = {
  setMessageContent: PropTypes.func,
  setShowPicker: PropTypes.func,
};
