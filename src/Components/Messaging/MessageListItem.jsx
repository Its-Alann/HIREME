import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Stack, IconButton, Typography } from "@mui/material";
import MessageOptions from "./MessageOptions";

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
  const { content, sender, attachment } = message;

  return (
    <Stack
      className="message-stack"
      container
      alignItems={alignment === "right" ? "flex-end" : "flex-start"}
      sx={{
        maxWidth: "100%",
        "&:hover .messageOptions": {
          display: "inline-block",
          color: "grey",
        },
      }}
    >
      <Box sx={{ px: "12px", maxWidth: "100%" }}>
        <Typography align={alignment} variant="subtitle2" color={textGray}>
          {sender}
        </Typography>
      </Box>

      <Box sx={{ display: "flex" }}>
        {alignment === "right" && (
          <MessageOptions
            index={index}
            convoId={convoId}
            reportMessage={reportMessage}
          />
        )}
        <Box
          xs
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
              sx={{ display: "inline-block" }}
              primary={content}
              align={alignment}
            >
              {content}
            </Typography>
          )}
        </Box>
        {alignment === "left" && <MessageOptions index={index} />}
      </Box>
      <Typography
        style={{ marginLeft: "12px", marginRight: "12px" }}
        align={alignment}
        variant="caption"
        color={textGray}
      >
        {timestamp.toLocaleString()}
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
