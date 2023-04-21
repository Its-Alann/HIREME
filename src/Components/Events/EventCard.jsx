import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Stack,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../Firebase/firebase";

const EventCard = (props) => {
  const { eventInfo, companyLogo, companyName, companyID, isRecruiter } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const removeEvent = async () => {
    try {
      const eventRef = doc(
        db,
        `companies2/${companyID}/events/${eventInfo.eventID}`
      );
      await deleteDoc(eventRef);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box key="job.documentID" sx={{ py: 1 }}>
      <Card variant="outlined">
        <Stack
          sx={{
            m: [2, 3],
            height: ["auto", "30rem"],
            maxHeight: "30rem",
            width: ["100%", "30rem"],
            maxWidth: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" sx={{ maxWidth: "95%" }}>
            <Box
              component="img"
              sx={{
                width: ["4rem", "6rem"],
                height: ["4rem", "6rem"],
                mr: [1, 2],
              }}
              src={companyLogo}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  maxWidth: "100%",
                  overflowWrap: "break-word",
                }}
              >
                {eventInfo.name}
              </Typography>
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
          <Box sx={{ my: 1 }}>
            <Typography sx={{ fontSize: 14 }}>
              {new Date(
                eventInfo.date.seconds * 1000 +
                  eventInfo.date.nanoseconds / 1000000
              ).toDateString()}
            </Typography>
            <Typography sx={{ mb: 2 }}>{eventInfo.address}</Typography>
            <Typography
              sx={{
                maxWidth: "90%",
                overflowWrap: "break-word",
              }}
            >
              {eventInfo.description}
            </Typography>
          </Box>

          {/* do we need to show company id? */}
          {/* <Typography>Company ID: {job.companyID}</Typography> */}

          <Stack
            direction={["column", "row"]}
            justifyContent={["flex-start", "flex-end"]}
            alignItems={["flex-start", "flex-end"]}
            sx={{ pt: 2 }}
            flex={1}
          >
            {/* add condition if user is a recruiter */}
            {isRecruiter && (
              <>
                <IconButton aria-label="Delete Event" onClick={handleClickOpen}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="Edit Event"
                  href={`/${companyID}/editEvent/${eventInfo.eventID}`}
                >
                  <EditIcon />
                </IconButton>
              </>
            )}

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
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Are you sure you want to delete the {`${eventInfo.name}`} event?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This action cannot be undone. The event will be deleted and
                  cannot be retrieved.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  onClick={removeEvent}
                  autoFocus
                  style={{ color: "red" }}
                >
                  Delete event
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

EventCard.propTypes = {
  eventInfo: PropTypes.shape({
    eventID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  companyName: PropTypes.string.isRequired,
  companyLogo: PropTypes.string.isRequired,
  companyID: PropTypes.string.isRequired,
  isRecruiter: PropTypes.bool.isRequired,
};

export default EventCard;
