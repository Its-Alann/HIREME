import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Stack from "@mui/material/Stack";
import ListItemText from "@material-ui/core/ListItemText";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../Firebase/firebase";

const MessageListItem = ({ content, sender, timestamp }) => {
  const [alignment, setAlignment] = React.useState("left");

  React.useEffect(() => {
    if (auth.currentUser.email === sender) {
      setAlignment("right");
    }
  }, [auth]);

  return (
    <Stack
      container
      sx={{ display: "inline-block" }}
      style={{ float: `${alignment}` }}
    >
      <Grid style={{ width: "100%" }}>
        <ListItemText
          secondary={sender}
          align={alignment}
          // sx={{ ml: 12 }}
          style={{
            marginLeft: "12px",
            marginRight: "12px",
            marginTop: "12px",
            maxWidth: "100%",
            // display: "block",
            // backgroundColor: "#D9D9D9",
          }}
        />
      </Grid>

      <Grid
        item
        xs={4}
        style={{
          backgroundColor: alignment === "right" ? "yellow" : "lime",
          maxWidth: "100%",
          padding: "12px",
          borderRadius: "16px",
          // display: "inline-flex",
          // wordBreak: "break-all",
          // overflowWrap: "break-word",
          // float: `${alignment}`,
        }}
      >
        <ListItemText
          sx={{ display: "inline-block" }}
          // align="left"
          primary={content}
          align={alignment}
          // float={alignment}
        />
      </Grid>
      <ListItemText
        style={{ marginLeft: "12px" }}
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
};
export default MessageListItem;
