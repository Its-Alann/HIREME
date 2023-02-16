import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
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
    <Grid container>
      <Grid item xs={12}>
        <ListItemText align={alignment} primary={content} />
      </Grid>
      <Grid item xs={12}>
        <ListItemText
          align={alignment}
          secondary={timestamp.toLocaleString()}
        />
      </Grid>
    </Grid>
  );
};

MessageListItem.propTypes = {
  content: PropTypes.string,
  timestamp: PropTypes.instanceOf(Date),
  sender: PropTypes.string,
};
export default MessageListItem;
