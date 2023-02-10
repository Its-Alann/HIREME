import * as React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ConnectionListItem from "./ConnectionListItem";

const ConnectionList = (props) => {
  const hello = "hello";
  return (
    <List>
      {props.connections.map((connection) => (
        <ListItem button key={connection}>
          <ConnectionListItem UID={connection} />
        </ListItem>
      ))}
    </List>
  );
};

ConnectionList.propTypes = {
  connections: PropTypes.arrayOf(PropTypes.any),
};
export default ConnectionList;
