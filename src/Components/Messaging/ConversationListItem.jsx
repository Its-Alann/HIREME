import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import { auth } from "../../Firebase/firebase";

const MessageListItem = (props) => {
  const [alignment, setAlignment] = React.useState("left");

  React.useEffect(() => {
    if (auth.currentUser.uid === props.sender) {
      setAlignment("right");
    }
  }, [auth]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <ListItemText align={alignment} primary={props.content} />
      </Grid>
      <Grid item xs={12}>
        <ListItemText align={alignment} secondary={props.timestamp} />
      </Grid>
    </Grid>
  );
};

MessageListItem.propTypes = {
  content: PropTypes.string,
  timestamp: PropTypes.string,
  sender: PropTypes.string,
};
export default MessageListItem;
