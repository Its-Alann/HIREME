import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Button,
  Container,
  InputAdornment,
  IconButton,
  Stack,
  Card,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import {
  collection,
  query,
  limitToLast,
  getDocs,
  orderBy,
  startAfter,
  endBefore,
  doc,
  getDoc,
  limit,
  updateDoc,
  where,
  getFirestore,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, app, storage } from "../../Firebase/firebase";

export const Company = () => {
  // Constants and functions
  const [companyInformation, setCompanyInformation] = useState({
    name: "",
    logoPath: "", // new state for the uploaded logo file
  });
  const [isNewJobAllowed, setIsNewJobAllowed] = useState(false);
  const [currentUserID, setCurrentUserID] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [jobs, setJobs] = useState([]);
  const [lastJob, setLastJob] = useState(null);
  const [firstJob, setFirstJob] = useState(null);
  const [companiesName, setCompaniesName] = useState({});
  const [companiesLogo, setCompaniesLogo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [favoriteCompanies, setFavoriteCompanies] = useState(null);
  const [savedJobs, setSavedJobs] = useState(null);
  const [updateSavedDB, setUpdateSavedDB] = useState(false);
  const [updateFavoriteDB, setUpdateFavoriteDB] = useState(false);
  const database = getFirestore(app);

  // Get the companyID fromt the url
  const URLcompanyID = useParams().companyID;

  const handleClick = () => {
    setEditMode(true);
  };

  // Only once, attach listener to onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const { uid, email } = authUser;
        console.log("uid", uid);
        console.log("useEffect: ", email);
        setUserEmail(email);
      } else {
        setUserEmail(null);
      }
    });
  }, []);

  //update db function for saved jobs if it exists in db, otherwise create field
  async function updateDbSaved() {
    if (updateSavedDB) {
      console.log("start update");
      if (userEmail !== null) {
        if (savedJobs !== null) {
          const userProfileDocRef = doc(database, "notifications", userEmail);
          await updateDoc(userProfileDocRef, { savedJobs });
        } else {
          const userProfileDocRef = doc(database, "notifications", userEmail);
          await updateDoc(userProfileDocRef, { savedJobs: [] });
          setSavedJobs([]);
        }
      }
      console.log("Update finished");
    }
  }

  //update db function for favorite companies if it exists in db, otherwise create field
  async function updateDbFavorites() {
    if (updateFavoriteDB) {
      console.log("start update");
      console.log(favoriteCompanies);
      if (userEmail !== null) {
        if (favoriteCompanies !== null) {
          const userProfileDocRef = doc(database, "notifications", userEmail);
          await updateDoc(userProfileDocRef, { favoriteCompanies });
        } else {
          const userProfileDocRef = doc(database, "notifications", userEmail);
          await updateDoc(userProfileDocRef, { favoriteCompanies: [] });
          setFavoriteCompanies([]);
        }
      }
      console.log("Update finished");
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (userEmail !== null) {
        const notificationsDocRef = doc(database, "notifications", userEmail);
        // Get notifications data and set it to local array
        const notificationsSnapShot = await getDoc(notificationsDocRef);
        if (notificationsSnapShot.exists()) {
          console.log("Notifications for user Exist");
          //set favorite companies
          if (notificationsSnapShot.data().favoriteCompanies !== undefined) {
            setFavoriteCompanies(
              notificationsSnapShot.data().favoriteCompanies
            );
          } else {
            setUpdateFavoriteDB(true);
          }
          //set saved jobs
          if (notificationsSnapShot.data().savedJobs !== undefined) {
            setSavedJobs(notificationsSnapShot.data().savedJobs);
          } else {
            setUpdateSavedDB(true);
          }
        } else {
          console.log("Notifications for user does not Exist");
        }
      }
    }
    console.log("get info from notifications collection");
    fetchData();
  }, [userEmail]);

  async function getCompanyInformation() {
    const companyRef = doc(db, "companies2", URLcompanyID);
    const companySnapshot = await getDoc(companyRef);
    if (companySnapshot.exists()) {
      setCompanyInformation(companySnapshot.data());
    }
  }

  async function uploadImage(image) {
    const imageName = `${URLcompanyID}-${Date.now()}`;
    const imageRef = ref(storage, `/company-logo/${imageName}`);
    await uploadBytes(imageRef, image);
    const downloadURL = await getDownloadURL(imageRef);
    setCompanyInformation({ ...companyInformation, logoPath: downloadURL });
  }

  async function saveCompanyInformation() {
    const companyRef = doc(db, "companies2", URLcompanyID);
    await updateDoc(companyRef, companyInformation);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged invoked");
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Number of jobs per page
  const jobsPerPage = 5;

  // Job  Query
  const initialJobsQuery = query(
    collection(db, "jobs2"),
    where("companyID", "==", URLcompanyID),
    orderBy("publishedAt"),
    limitToLast(jobsPerPage)
  );
  const nextJobsQuery = query(
    collection(db, "jobs2"),
    where("companyID", "==", URLcompanyID),
    orderBy("publishedAt"),
    endBefore(lastJob),
    limitToLast(jobsPerPage)
  );
  const previousJobsQuery = query(
    collection(db, "jobs2"),
    where("companyID", "==", URLcompanyID),
    orderBy("publishedAt"),
    startAfter(firstJob),
    limit(jobsPerPage)
  );

  // The alternative way is to fetch the entire collection
  // to the local machine, storing it in a list.
  // But I don't want to do it that way.
  // Because it can become heavy as the collection grows,
  // and also may cause security issues.
  async function getJobs(jobsQuery) {
    const jobsSnapshot = await getDocs(jobsQuery);

    // if none document returned, skip
    if (jobsSnapshot.docs.length < 1) {
      return;
    }

    setLastJob(jobsSnapshot.docs[0]);
    setFirstJob(jobsSnapshot.docs[jobsSnapshot.docs.length - 1]);

    const temp = [];
    jobsSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), documentID: document.id });
    });
    temp.reverse();
    setJobs(temp);
  }

  async function getPermissions() {
    if (currentUserID) {
      const selfRecruiterSnapshot = await getDoc(
        doc(db, "recruiters2", currentUserID)
      );
      if (selfRecruiterSnapshot.exists()) {
        console.log("Recruiter does not exist");
        if (selfRecruiterSnapshot.data().workFor === URLcompanyID) {
          setIsAdmin(true);
          setIsNewJobAllowed(true);
        } else {
          setIsAdmin(false);
          setIsNewJobAllowed(false);
        }
      }
    }
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    const temp2 = companiesLogo;

    jobs.forEach(async (job) => {
      const companyRef = doc(db, "companies2", URLcompanyID);
      const companySnapshot = await getDoc(companyRef);
      if (!temp[URLcompanyID]) {
        temp[URLcompanyID] = "querying";
        temp[URLcompanyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
      if (companySnapshot.data().logoPath === "") {
        temp2[URLcompanyID] =
          "https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_whitebg.png?alt=media&token=c621d215-a3db-4557-8c06-1618905b5ab0";
      } else temp2[URLcompanyID] = companySnapshot.data().logoPath;
      setCompaniesLogo({ ...temp2 });
    });
  }

  useEffect(() => {
    getCompanyInformation();
    getJobs(initialJobsQuery);
  }, [URLcompanyID]);

  useEffect(() => {
    console.log("jobs ", jobs);
    getCompaniesName();
  }, [jobs]);

  useEffect(() => {
    getPermissions();
  }, [currentUserID]);

  const handleRemoveSaved = (jobId) => {
    setSavedJobs((prev) => prev.filter((temp) => temp !== jobId));
    setUpdateSavedDB(true);
  };

  const handleAddSaved = (jobId) => {
    setSavedJobs((prev) => [...prev, jobId]);
    setUpdateSavedDB(true);
  };

  //this is used as a buffer to make sure the savedJobs state is updated before updating the db
  useEffect(() => {
    updateDbSaved();
    setUpdateSavedDB(false);
  }, [updateSavedDB]);

  const handleRemoveFavorite = (companyId) => {
    setFavoriteCompanies((prev) => prev.filter((temp) => temp !== companyId));
    setUpdateFavoriteDB(true);
  };

  const handleAddFavorite = (companyId) => {
    console.log(companyId);
    setFavoriteCompanies((prev) => [...prev, companyId]);
    setUpdateFavoriteDB(true);
  };

  //this is used as a buffer to make sure the savedJobs state is updated before updating the db
  useEffect(() => {
    updateDbFavorites();
    setUpdateFavoriteDB(false);
  }, [updateFavoriteDB]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            minWidth: "500px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isAdmin ? (
            <TextField
              required
              id="TextField-CompanyName"
              variant="standard"
              placeholder="Company name"
              label="Company Name"
              name="companyName"
              margin="normal"
              value={companyInformation.name}
              onChange={(e) =>
                setCompanyInformation({
                  ...companyInformation,
                  name: e.target.value,
                })
              }
              sx={{
                fontSize: "3em",
              }}
              data-cy="Textfield-CompanyName"
              InputProps={{
                style: { fontSize: 30 },
                endAdornment: !editMode ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClick}
                      data-cy="Button-Edit-CompanyName"
                    >
                      <Edit />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ""
                ),
              }}
            />
          ) : (
            <Typography id="TextField-Name" variant="h2" margin="normal">
              {companyInformation.name}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "5%",
          }}
        >
          {isAdmin && (
            <>
              <Typography>Modify company logo</Typography>
              <IconButton>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files.length < 1) {
                      return;
                    }
                    uploadImage(e.target.files[0]);
                  }}
                />
              </IconButton>
            </>
          )}
        </Box>

        <Avatar
          alt="Upload Image"
          src={companyInformation.logoPath}
          sx={{
            width: { xs: 100, sm: 150, md: 200 },
            height: { xs: 100, sm: 150, md: 200 },
          }}
          style={{
            backgroundColor: "white",
            border: "solid",
            borderColor: "#263aaf",
            color: "#263aaf",
          }}
        />

        {isAdmin && (
          <Button
            onClick={() => {
              saveCompanyInformation();
              setEditMode(false);
            }}
            data-cy="saveBtn"
            variant="contained"
            size="medium"
            sx={{ my: 1 }}
            id="Button-Save"
          >
            Save
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          padding: "25px",
          alignItems: "left",
        }}
      >
        {isNewJobAllowed && (
          <Link to="/createJob">
            <Button
              id="Button-NewJob"
              variant="contained"
              data-cy="Button-NewJob"
            >
              <Typography variant="h5">New Job</Typography>
            </Button>
          </Link>
        )}
        {!isNewJobAllowed &&
        userEmail !== null &&
        favoriteCompanies != null &&
        favoriteCompanies.includes(URLcompanyID) ? (
          <>
            <StarIcon
              sx={{ cursor: "pointer", my: "auto", ml: "auto" }}
              onClick={() => handleRemoveFavorite(URLcompanyID)}
            />
            <Typography
              sx={{ cursor: "pointer", my: "auto" }}
              onClick={() => handleRemoveFavorite(URLcompanyID)}
            >
              Unfavorite Company
            </Typography>
          </>
        ) : (
          <>
            <StarOutlineIcon
              sx={{ cursor: "pointer", my: "auto", ml: "auto" }}
              onClick={() => handleAddFavorite(URLcompanyID)}
            />
            <Typography
              sx={{ cursor: "pointer", my: "auto" }}
              onClick={() => handleAddFavorite(URLcompanyID)}
            >
              Favorite Company
            </Typography>
          </>
        )}
      </Box>

      <Container maxWidth sx={{ mb: 10 }}>
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" sx={{ pb: 2 }}>
            Browse Jobs
          </Typography>

          {jobs.map((job) => {
            const hello = "hello";

            // do this to show what is inside job
            // console.log(job);
            return (
              // Create cards instead
              <Box key={job.documentID} sx={{ py: 1 }}>
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
                        src={companiesLogo[job.companyID]}
                      />
                      <Box>
                        <Typography variant="h4">{job.title}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <Typography>
                            {companiesName[job.companyID]}
                          </Typography>
                        </Box>
                        <Typography>{`${job.city}, ${job.country}`}</Typography>
                      </Box>
                      <Box sx={{ ml: "auto", mb: "auto" }}>
                        {savedJobs != null &&
                        savedJobs.includes(job.documentID) ? (
                          <Button
                            id="save-btn"
                            variant="contained"
                            data-cy="unsave-button"
                            sx={{
                              backgroundColor: "black",
                              m: 2,
                              height: 30,
                              width: 100,
                              textTransform: "none",
                            }}
                            onClick={() => handleRemoveSaved(job.documentID)}
                          >
                            Unsave
                          </Button>
                        ) : (
                          <Button
                            id="save-btn"
                            variant="contained"
                            data-cy="save-button"
                            sx={{
                              backgroundColor: "black",
                              m: 2,
                              height: 30,
                              width: 100,
                              textTransform: "none",
                            }}
                            onClick={() => handleAddSaved(job.documentID)}
                          >
                            Save
                          </Button>
                        )}
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
                        id={`Button-${job.documentID}`}
                      >
                        {/* if there's no link field in db, button links to viewJobPosting, otherwise external link */}
                        {job.link === undefined || job.link === "" ? (
                          <Link
                            to={`/viewJobPosting/${job.companyID}/${job.documentID}`}
                            className="link"
                            underline="none"
                            style={{ textDecoration: "none" }}
                          >
                            {/* <Link to="/job/1"> */}
                            View job
                          </Link>
                        ) : (
                          <a
                            href={job.link}
                            style={{ color: "white", textDecoration: "none" }}
                          >
                            Apply On Other Site
                          </a>
                        )}
                      </Button>
                      <Typography>
                        Deadline:{" "}
                        {new Date(
                          job.deadline.seconds * 1000 +
                            job.deadline.nanoseconds / 1000000
                        ).toDateString()}
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              </Box>
            );
          })}
          <Button
            id="Button-Previous"
            onClick={() => getJobs(previousJobsQuery)}
          >
            Previous
          </Button>
          <Button id="Button-Next" onClick={() => getJobs(nextJobsQuery)}>
            Next
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Company;
