import * as React from "react";
import PropTypes from "prop-types";

const ConnectionListItem = (props) => {
  let length = 0;
  console.log(props.content);
  if (props.content == null) {
    length = -1;
  } else {
    console.log(props.content);
  }
  return (
    <>
      <p>{length}</p>
      {props.content}
      {props.sender}{" "}
    </>
  );
};

ConnectionListItem.propTypes = {
  content: PropTypes.string,
  sender: PropTypes.string,
  timestamp: PropTypes.string,
};
export default ConnectionListItem;
