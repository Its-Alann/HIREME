import React from "react";
import PropTypes from "prop-types";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { IconButton } from "@mui/material";

const FileUpload = ({ onFileChange }) => (
  <IconButton variant="contained" component="label">
    <AttachFileSharpIcon color="primary" />
    <input
      type="file"
      hidden
      onChange={onFileChange}
      name="uploadInput"
      id="upload"
    />
  </IconButton>
);

FileUpload.propTypes = {
  onFileChange: PropTypes.func,
};

export default FileUpload;
