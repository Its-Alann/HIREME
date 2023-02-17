import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

import ListItemText from "@material-ui/core/ListItemText";
import { Timestamp } from "firebase/firestore";
// import { auth } from "../../Firebase/firebase";

const MessageListItem = ({ content, sender, timestamp, alignment }) => {
  const antinos = "🖖";
  return (
    <Stack
      className="message-stack"
      container
      alignItems={alignment === "right" ? "flex-end" : "flex-start"}
    >
      <Box sx={{ px: "12px", maxWidth: "100%" }}>
        <ListItemText secondary={sender} align={alignment} />
      </Box>

      <Box
        sx={{
          bgcolor: alignment === "right" ? "secondary.main" : "gray.main",
          width: "fit-content",
          maxWidth: "100%",
          p: 1.5,
          borderRadius: 3,
        }}
      >
        <ListItemText
          sx={{ display: "inline-block" }}
          primary={content}
          align={alignment}
        />
      </Box>
      <ListItemText
        style={{ marginLeft: "12px", marginRight: "12px" }}
        align={alignment}
        secondary={timestamp.toLocaleString()}
      />
    </Stack>
  );
};

MessageListItem.propTypes = {
  content: PropTypes.string,
  timestamp: PropTypes.instanceOf(Date),
  sender: PropTypes.string,
  alignment: PropTypes.string,
};
export default MessageListItem;
