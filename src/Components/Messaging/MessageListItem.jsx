import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Stack,
  ListItemText,
  Link,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";
// import { auth } from "../../Firebase/firebase";

const MessageListItem = ({
  content,
  attachment,
  sender,
  timestamp,
  alignment,
}) => {
  const antinos = "🖖";
  return (
    <Stack
      className="message-stack"
      container
      alignItems={alignment === "right" ? "flex-end" : "flex-start"}
      sx={{ maxWidth: "100%" }}
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
        {attachment ? (
          // <ListItemButton sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemText
              sx={{
                display: "inline-block",
                "&:hover": {
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
              primary={`🔗${attachment}`}
              align={alignment}
              // onClick={}
            />
          </ListItem>
        ) : (
          // </ListItemButton>
          <ListItemText
            sx={{ display: "inline-block" }}
            primary={content}
            align={alignment}
          />
        )}
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
  attachment: PropTypes.string,
  timestamp: PropTypes.instanceOf(Date),
  sender: PropTypes.string,
  alignment: PropTypes.string,
};
export default MessageListItem;
