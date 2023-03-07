import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Stack, ListItemText, ListItem, Typography } from "@mui/material";

const MessageListItem = ({
  content,
  attachment,
  sender,
  timestamp,
  alignment,
  openAttachment,
  index,
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
        <Typography
          align={alignment}
          variant="subtitle2"
          color="rgba(0, 0, 0, 0.6)"
        >
          {sender}
        </Typography>
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
          <Typography
            sx={{
              display: "inline-block",
              "&:hover": {
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
            align={alignment}
            onClick={() => openAttachment(attachment)}
            data-testid="attachment"
          >
            {`🔗${attachment}`}
          </Typography>
        ) : (
          <Typography
            sx={{ display: "inline-block" }}
            primary={content}
            align={alignment}
          >
            {content}
          </Typography>
        )}
      </Box>
      <Typography
        style={{ marginLeft: "12px", marginRight: "12px" }}
        align={alignment}
        variant="caption"
        color="rgba(0, 0, 0, 0.6)"
      >
        {timestamp.toLocaleString()}
      </Typography>
    </Stack>
  );
};

MessageListItem.propTypes = {
  content: PropTypes.string,
  attachment: PropTypes.string,
  timestamp: PropTypes.instanceOf(Date),
  sender: PropTypes.string,
  alignment: PropTypes.string,
  openAttachment: PropTypes.func,
  index: PropTypes.number,
};
export default MessageListItem;
