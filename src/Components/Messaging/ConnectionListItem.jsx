import * as React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

const ConnectionListItem = (props) => {
  // Really fking mysterious
  // Won't udpate without this Hello??? wtF??
  const hello = "hello";
  return (
    <>
      <ListItemIcon>
        <Avatar
          alt={props.UID}
          src="https://material-ui.com/static/images/avatar/1.jpg"
        />
      </ListItemIcon>
      <ListItemText primary={props.UID}>{props.UID}</ListItemText>
    </>
  );
};

ConnectionListItem.propTypes = {
  UID: PropTypes.string,
};
export default ConnectionListItem;
