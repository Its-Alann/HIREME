import React from "react";
import PropTypes from "prop-types";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { Button } from "@mui/material";

const FileUpload = ({ onFileChange }) => (
  <Button variant="contained" component="label">
    <AttachFileSharpIcon />
    <input
      type="file"
      hidden
      onChange={onFileChange}
      name="uploadInput"
      id="upload"
    />
  </Button>
);

FileUpload.propTypes = {
  onFileChange: PropTypes.func,
};

export default FileUpload;
