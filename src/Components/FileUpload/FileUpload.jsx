import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";

const FileUpload = ({ onFileChange, onFileUpload }) => (
  <>
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

    <Button
      onClick={() => {
        onFileUpload();
      }}
    >
      Upload!
    </Button>
  </>
);

FileUpload.propTypes = {
  onFileChange: PropTypes.func,
  onFileUpload: PropTypes.func,
};

export default FileUpload;
