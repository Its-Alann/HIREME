import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import * as React from "react";
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
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
// import JobPostingApplicants from "../Recruiter/JobPostingApplicants";
import { Link } from "react-router-dom";
import { auth, db, app } from "../../Firebase/firebase";
import "./Job.css";

export const BrowseJobs = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [lastJob, setLastJob] = useState(null);
  const [firstJob, setFirstJob] = useState(null);
  const [companiesName, setCompaniesName] = useState({});
  const [companiesLogo, setCompaniesLogo] = useState({});
  const [favCompanyStrIn, setFavCompanyStrIn] = useState("");
  const [favCompanyStrOut, setFavCompanyStrOut] = useState("");
  const [favCompanyArr, setFavCompanyArr] = useState([]);
  const [hasFavorite, setHasFavorite] = useState(false);
  const database = getFirestore(app);

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

  useEffect(() => {
    async function fetchData() {
      if (userEmail !== null) {
        const notificationsDocRef = doc(database, "notifications", userEmail);
        // Get notifications data and set it to local array
        const notificationsSnapShot = await getDoc(notificationsDocRef);
        if (notificationsSnapShot.exists()) {
          console.log("Notifications for user Exist");
          if (notificationsSnapShot.data().favCompanies !== undefined) {
            setFavCompanyStrIn(notificationsSnapShot.data().favCompanies);
          } else {
            setFavCompanyStrIn("");
          }
        } else {
          console.log("Notifications for user does not Exist");
        }
      }
    }
    console.log("get fav companies");
    fetchData();
  }, [userEmail]);

  useEffect(() => {
    if (favCompanyStrIn !== "") {
      setFavCompanyArr(favCompanyStrIn.split(","));
      setHasFavorite(true);
    } else {
      console.log("empty favs");
    }
  }, [favCompanyStrIn]);

  const isFavorite = (companyID) => {
    //console.log("isFav called");
    if (hasFavorite) {
      for (let i = 0; i < favCompanyArr.length; i += 1) {
        //console.log(favCompanyArr[i]);
        if (favCompanyArr[i] === companyID) {
          // console.log(
          //   "companyID: ",
          //   companyID,
          //   " matches company: ",
          //   favCompanyArr[i]
          // );
          return true;
        }
        // console.log(
        //   "companyID: ",
        //   typeof companyID,
        //   " not company: ",
        //   typeof company
        // );
      }
    }
    //console.log("here");
    return false;
  };

  const handleMakeFavorite = (companyId) => {
    if (!favCompanyArr.includes(companyId)) {
      setFavCompanyArr((prevList) => [...prevList, companyId]);
    }
  };

  const handleRemoveFavorite = (companyId) => {
    setFavCompanyArr((prev) => prev.filter((temp) => temp !== companyId));
  };

  useEffect(() => {
    console.log(favCompanyArr);
    setFavCompanyStrOut(favCompanyArr.join());
  }, [favCompanyArr]);

  useEffect(() => {
    try {
      const notificationsDocRef = doc(database, "notifications", userEmail);
      updateDoc(notificationsDocRef, { favCompanies: favCompanyStrOut });
    } catch (err) {
      console.log(err);
    }
    setFavCompanyStrIn(favCompanyStrOut);
  }, [favCompanyStrOut]);

  const jobsPerPage = 5;

  // The purpose of this query is to get jobs sorted descending by published date
  // Firebase does not have desc orderby
  // hence, use the ascending order & limit to last
  // For example I have 7 jobs.
  // 1 2 3 4 5 6 7
  //     x x x x x
  // these will be selected.
  // then shown in reverse order.
  const initialJobsQuery = query(
    collection(db, "jobs2"),
    orderBy("publishedAt"),
    limitToLast(jobsPerPage)
  );

  // The matter with firstJob & lastJob.
  // After a query executed
  // For example I have 7 jobs.
  // 1 2 3 4 5 6 7
  //     x x x x x
  //     L       F
  // x  is selected jobs.
  // L is last job.
  // F is first job.

  // nextJobsQuery end the query before the lastJob
  // For example, now I have 3 as lastJob
  // 1 2 3 4 5 6 7
  // x x
  // these will be selected
  // then
  // L F
  // 1 & 2 become the new lastJob & firstJob
  const nextJobsQuery = query(
    collection(db, "jobs2"),
    orderBy("publishedAt"),
    endBefore(lastJob),
    limitToLast(jobsPerPage)
  );

  // previousJobsQuery start the query after the firstJob
  // For example, now I have 2 as firstJob
  // 1 2 3 4 5 6 7
  //     x x x x x
  // these will be selected// then
  //     L       F
  // 3 & 7 become the new lastJob & firstJob
  const previousJobsQuery = query(
    collection(db, "jobs2"),
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

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    const temp2 = companiesLogo;

    jobs.forEach(async (job) => {
      const companyRef = doc(db, "companies2", job.companyID);
      const companySnapshot = await getDoc(companyRef);
      if (!temp[job.companyID]) {
        temp[job.companyID] = "querying";
        temp[job.companyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
      if (companySnapshot.data().logoPath === "") {
        temp2[job.companyID] =
          "https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_whitebg.png?alt=media&token=c621d215-a3db-4557-8c06-1618905b5ab0";
      } else temp2[job.companyID] = companySnapshot.data().logoPath;
      setCompaniesLogo({ ...temp2 });
    });
  }

  React.useEffect(() => {
    getCompaniesName();
  }, [jobs]);

  React.useEffect(() => {
    getJobs(initialJobsQuery);
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Browse Jobs
        </Typography>
        <Typography>
          This Page list all jobs, {jobsPerPage} per page. Everyone can access
          this page.
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
                        <Typography>{companiesName[job.companyID]}</Typography>
                        {userEmail !== null &&
                          (isFavorite(job.companyID) ? (
                            <StarIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() =>
                                handleRemoveFavorite(job.companyID)
                              }
                            />
                          ) : (
                            <StarOutlineIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => handleMakeFavorite(job.companyID)}
                            />
                          ))}
                      </Box>
                      <Typography>{`${job.city}, ${job.country}`}</Typography>
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
        <Button id="Button-Previous" onClick={() => getJobs(previousJobsQuery)}>
          Previous
        </Button>
        <Button id="Button-Next" onClick={() => getJobs(nextJobsQuery)}>
          Next
        </Button>
      </Box>
    </Container>
  );
};
export default BrowseJobs;
