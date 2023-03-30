import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Stack, IconButton, Typography, Badge } from "@mui/material";
import MessageOptions from "./MessageOptions";
import { auth } from "../../Firebase/firebase";

const MessageListItem = ({
  message,
  alignment,
  openAttachment,
  index,
  convoId,
  reportMessage,
}) => {
  const antinos = "🖖";
  const textGray = "rgba(0, 0, 0, 0.6)";

  const timestamp = message.timestamp.toDate();
  const { content, sender, attachment, reported } = message;

  // filter(Boolean) removes the comma from the beginning
  const seenBy = message.seenBy.sort().filter(Boolean).join(", ");

  console.log("seenBy", seenBy);

  return (
    <Stack
      className="message-stack"
      alignItems={alignment === "right" ? "flex-end" : "flex-start"}
    >
      <Box sx={{ px: "12px", maxWidth: "100%" }}>
        <Typography align={alignment} variant="subtitle2" color={textGray}>
          {sender}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", maxWidth: "100%" }}>
        {/* {alignment === "right" && (
          <MessageOptions
            index={index}
            convoId={convoId}
            reportMessage={reportMessage}
            reported={reported}
          />
        )} */}
        <Badge
          badgeContent="!"
          color="warning"
          anchorOrigin={{ vertical: "top", horizontal: alignment }}
          invisible={!reported}
          sx={{ flexGrow: 1 }}
          data-testid="reportedBadge"
        >
          <Box
            sx={{
              bgcolor: alignment === "right" ? "secondary.main" : "gray.main",
              width: "fit-content",
              maxWidth: "calc(100% - 24px)",
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
                sx={{ display: "inline-block", flexShrink: 0 }}
                primary={content}
                align={alignment}
              >
                {content}
              </Typography>
            )}
          </Box>
        </Badge>
        {alignment === "left" && (
          <MessageOptions
            index={index}
            convoId={convoId}
            reportMessage={reportMessage}
            reported={reported}
          />
        )}
      </Box>

      <Typography
        style={{ marginLeft: "12px", marginRight: "12px" }}
        align={alignment}
        variant="caption"
        color={textGray}
      >
        {timestamp.toLocaleString()}
      </Typography>

      <Typography
        className="seenByTag"
        style={{
          marginLeft: "12px",
          marginRight: "12px",
        }}
        align="right"
        variant="caption"
        color={textGray}
      >
        Seen by {seenBy}
      </Typography>
    </Stack>
  );
};

MessageListItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  message: PropTypes.object,
  alignment: PropTypes.string,
  openAttachment: PropTypes.func,
  index: PropTypes.number,
  convoId: PropTypes.string,
  reportMessage: PropTypes.func,
};
export default MessageListItem;
