import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Stack, IconButton, Typography } from "@mui/material";

const MessageOptions = () => {
  const antinos = "🖖";
  return (
    <IconButton
      className="messageOptions"
      size="small"
      disableRipple
      sx={{
        height: "fit-content",
        alignSelf: "center",
        p: 0,
        display: "none",
      }}
    >
      <MoreVertIcon />
    </IconButton>
  );
};

export default MessageOptions;
