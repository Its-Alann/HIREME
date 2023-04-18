/* eslint-disable react/function-component-definition */
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { PropTypes } from "prop-types";
import React, { useState } from "react";

function EmployeeCard({
  employeeId,
  employeeFirstName,
  employeeLastName,
  employeeImage,
  description,
  children,
}) {
  const [employeeDescription, setEmployeeDescription] = useState("");

  return (
    <Box sx={{ height: "100%" }}>
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="user"
              sx={{ width: 56, height: 56 }}
              src={employeeImage}
            />
          }
          title={
            employeeFirstName !== "" && employeeLastName !== ""
              ? `${employeeFirstName} ${employeeLastName}`
              : "No name"
          }
          subheader={employeeId}
        />
        <Typography sx={{ marginLeft: "25%" }}>
          {description !== "" && description != null
            ? `${description}`
            : "No bio"}
        </Typography>
        <br />
        {children}
      </Card>
    </Box>
  );
}

EmployeeCard.propTypes = {
  employeeId: PropTypes.string.isRequired,
  employeeFirstName: PropTypes.string.isRequired,
  employeeLastName: PropTypes.string.isRequired,
  employeeImage: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default EmployeeCard;
