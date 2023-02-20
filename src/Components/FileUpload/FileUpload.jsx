import React from "react";
import PropTypes from "prop-types";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";

const FileUpload = ({ onFileChange }) => (
  <label
    className="chooseFile"
    htmlFor="file_input"
    style={{ cursor: "pointer" }}
  >
    <input
      id="file_input"
      name="file_input"
      type="file"
      onChange={onFileChange}
      style={{ display: "none" }}
    />
    <AttachFileSharpIcon />
  </label>
);

FileUpload.propTypes = {
  onFileChange: PropTypes.func,
};

export default FileUpload;
