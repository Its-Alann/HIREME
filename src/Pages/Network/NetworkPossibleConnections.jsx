/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { PossibleConnectionCard } from "../../Components/Network/PossibleConnectionCard";

const theme = createTheme();

export const NetworkPossibleConnections = ({
  allUserProfiles,
  nonConnectedUsersID,
  currentUserEmail,
}) => {
  const [nonConnectedUsersArr, setNonConnectedUsersArr] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [showingNonConnectedUsers, setShowingNonConnectedUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 15;

  function paginate(arr, pageSize, pageNum) {
    return arr.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  }

  const nextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    setPageNumber(pageNumber - 1);
  };

  useEffect(() => {
    setShowingNonConnectedUsers(
      paginate(nonConnectedUsersArr, pageSize, pageNumber)
    );
    console.log(showingNonConnectedUsers);
  }, [pageNumber, nonConnectedUsersArr]);

  useEffect(() => {
    //console.log(nonConnectedUsersID);
    setNonConnectedUsersArr(nonConnectedUsersID);
    setCurrentUser(currentUserEmail);
  }, [nonConnectedUsersID]);

  useEffect(() => {
    setAllUsers(allUserProfiles);
    // console.log(paginate(nonConnectedUsersArr, pageSize, pageNumber));
  }, [allUserProfiles]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xxl">
        <Stack alignItems="center">
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            data-cy="connectionsBox"
          >
            {showingNonConnectedUsers?.length > 0 &&
            showingNonConnectedUsers != null ? (
              <Grid
                container
                display="flex"
                justifyContent="center"
                alignItems="center"
                data-cy="connectionGrid"
              >
                {showingNonConnectedUsers.map((possibleConnectionUserID) => (
                  <Grid item sx={{ m: 2 }}>
                    <PossibleConnectionCard
                      allUserProfiles={allUsers}
                      possibleConnectionUserId={possibleConnectionUserID.id}
                      currentUser={currentUser}
                      data-cy={`gridItem${possibleConnectionUserID}`}
                      id={`gridItem${possibleConnectionUserID}`}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No connections yet :/</Typography>
            )}
          </Box>
          {nonConnectedUsersArr?.length > pageSize ? (
            <Box sx={{ mt: 2 }}>
              <Button
                id="Button-Previous"
                onClick={prevPage}
                disabled={pageNumber === 1}
              >
                Prev
              </Button>
              <Button
                id="Button-Next"
                onClick={nextPage}
                disabled={
                  pageNumber ===
                  Math.ceil(nonConnectedUsersArr.length / pageSize)
                }
              >
                Next
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

NetworkPossibleConnections.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  nonConnectedUsersID: PropTypes.arrayOf(PropTypes.Object).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default NetworkPossibleConnections;
