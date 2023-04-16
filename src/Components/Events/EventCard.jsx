import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const EventCard = (props) => {
  const { eventInfo, companyLogo, companyName } = props;

  return (
    <Box key="job.documentID" sx={{ py: 1 }}>
      <Card variant="outlined">
        <Box sx={{ m: 3 }}>
          <Stack direction="row" alignItems="center">
            <Box
              component="img"
              sx={{
                // objectFit: "cover",
                width: "6rem",
                height: "6rem",
                mr: 2,
              }}
              src={companyLogo}
            />
            <Box>
              <Typography variant="h4">{eventInfo.name}</Typography>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography>{companyName}</Typography>
                {/* {userEmail !== null &&
                  (isFavorite(job.companyID) ? (
                    <StarIcon
                      sx={{ cursor: "pointer" }}
                      //   onClick={() => handleRemoveFavorite(job.companyID)}
                    />
                  ) : (
                    <StarOutlineIcon
                      sx={{ cursor: "pointer" }}
                      //   onClick={() => handleMakeFavorite(job.companyID)}
                    />
                  ))} */}
              </Box>
              {/* <Typography>{`${job.city}, ${job.country}`}</Typography> */}
            </Box>
          </Stack>

          {/* do we need to show company id? */}
          {/* <Typography>Company ID: {job.companyID}</Typography> */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            sx={{ pt: 2 }}
          >
            {/* Added this button for candidate's view */}
            <Button
              variant="contained"
              size="medium"
              sx={{ my: 1 }}
              //   id={`Button-${job.documentID}`}
            >
              {/* if there's no link field in db, button links to viewJobPosting, otherwise external link */}
              {
                //   job.link === undefined || job.link === "" ? (
                //     <Link
                //       to={`/viewJobPosting/${job.companyID}/${job.documentID}`}
                //       className="link"
                //       underline="none"
                //       style={{ textDecoration: "none" }}
                //     >
                //       {/* <Link to="/job/1"> */}
                //       View job
                //     </Link>
                //   ) : (
                //     <a
                //       href="job.link"
                //       style={{ color: "white", textDecoration: "none" }}
                //     >
                //       Apply On Other Site
                //     </a>
                //   )
              }
              I&apos;m interested
            </Button>
            <Typography>
              Date:{" "}
              {new Date(
                eventInfo.date.seconds * 1000 +
                  eventInfo.date.nanoseconds / 1000000
              ).toDateString()}
            </Typography>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

EventCard.propTypes = {
  eventInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  companyName: PropTypes.string.isRequired,
  companyLogo: PropTypes.string.isRequired,
};

export default EventCard;
