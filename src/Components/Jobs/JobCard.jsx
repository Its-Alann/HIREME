import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Box, Card, Stack, Typography, Button } from "@mui/material";

const JobCard = ({
  companyID,
  companyName,
  jobID,
  title,
  city,
  country,
  deadlineSeconds,
  deadlineNanoSeconds,
  logo,
  editable,
}) => (
  <Box sx={{ py: 1, px: "5%" }}>
    <Card variant="outlined">
      <Box sx={{ m: 3 }}>
        <Stack direction="row" alignItems="center">
          {companyID === undefined ? (
            <Box
              component="img"
              sx={{
                // objectFit: "cover",
                width: "0.25",
                height: "0.25",
                mr: 2,
              }}
              src="https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FDefault_logo.png?alt=media&token=bd9790a2-63bb-4083-8c4e-fba1a8fca4a3"
            />
          ) : (
            <Box
              component="img"
              sx={{
                // objectFit: "cover",
                width: "6rem",
                height: "6rem",
                mr: 2,
              }}
              src={logo}
            />
          )}
          <Box>
            <Typography variant="h4">{title}</Typography>
            <Link to={`/viewCompany/${companyID}`}>
              <Typography>{companyName}</Typography>
            </Link>
            <Typography>{`${city}, ${country}`}</Typography>
          </Box>
        </Stack>

        {/* <Link
              to={{
                pathname: `/editJob/${job.documentID}`,
              }}
            >
              <Button id={`Button-Edit-${job.documentID}`}>Edit</Button>
            </Link> */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ pt: 2 }}
        >
          {/* button for recruiter's view */}
          <Button
            variant="contained"
            size="medium"
            sx={{ my: 1 }}
            id={`Button-${jobID}`}
            data-cy="view"
          >
            {editable ? (
              <Link
                to={`/viewJobPostingApplicants/${companyID}/${jobID}`}
                className="link"
                underline="none"
                style={{ textDecoration: "none", color: "white" }}
              >
                View job
              </Link>
            ) : (
              <Link
                to={`/viewJobPosting/${companyID}/${jobID}`}
                className="link"
                underline="none"
                style={{ textDecoration: "none", color: "white" }}
              >
                View job
              </Link>
            )}
          </Button>
          <Typography>
            Deadline:{" "}
            {new Date(
              deadlineSeconds * 1000 + deadlineNanoSeconds / 1000000
            ).toDateString()}
          </Typography>
        </Stack>
      </Box>
    </Card>
  </Box>
);
JobCard.propTypes = {
  companyID: PropTypes.string,
  companyName: PropTypes.string,
  jobID: PropTypes.string,
  title: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  deadlineSeconds: PropTypes.number,
  deadlineNanoSeconds: PropTypes.number,
  logo: PropTypes.string,
  editable: PropTypes.bool,
};
export default JobCard;