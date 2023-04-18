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
  employeeDescription,
  children,
}) {
  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardHeader
          sx={{
            display: "flex",
            overflow: "hidden",
            "& .MuiCardHeader-content": {
              overflow: "hidden",
            },
          }}
          avatar={
            <Avatar
              aria-label="user"
              sx={{ width: { xs: 32, sm: 56 }, height: { xs: 32, sm: 56 } }}
              src={employeeImage}
            />
          }
          title={
            employeeFirstName !== "" && employeeLastName !== ""
              ? `${employeeFirstName} ${employeeLastName}`
              : "No name"
          }
          titleTypographyProps={{ noWrap: true }}
          subheader={employeeId}
          subheaderTypographyProps={{ noWrap: true }}
        />
        <Typography sx={{ marginLeft: "25%" }}>
          {employeeDescription !== "" && employeeDescription != null
            ? `${employeeDescription}`
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
  employeeDescription: PropTypes.string,
  children: PropTypes.node,
};

export default EmployeeCard;
