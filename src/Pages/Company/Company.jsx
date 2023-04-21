import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
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
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, app } from "../../Firebase/firebase";

export const Company = () => {
  // Constants and functions
  const [currentUserID, setCurrentUserID] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [lastJob, setLastJob] = useState(null);
  const [firstJob, setFirstJob] = useState(null);
  const [companiesName, setCompaniesName] = useState({});
  const [companiesLogo, setCompaniesLogo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const database = getFirestore(app);

  // Get the companyID fromt the url
  const URLcompanyID = useParams().companyID;

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged invoked");
      if (user) {
        setCurrentUserID(user.uid);
        setUserEmail(user.email);
      } else {
        setCurrentUserID(null);
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Number of jobs per page
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
    where("companyID", "=", URLcompanyID)
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

  // async function getPermissions() {
  //   if (currentUserID) {
  //     const selfRecruiterSnapshot = await getDoc(
  //       doc(db, "recruiters2", currentUserID)
  //     );
  //     console.log("passed");
  //     if (selfRecruiterSnapshot.data().isManager) {
  //       setIsAdmin(true);
  //       setIsNewJobAllowed(true);
  //     } else if (selfRecruiterSnapshot.data().workFor !== companyID) {
  //       setIsAdmin(false);
  //       setIsNewJobAllowed(false);
  //     } else {
  //       const managersSnapshot = await getDocs(
  //         query(
  //           collection(db, "recruiters2"),
  //           where("workFor", "==", companyID),
  //           where("isManager", "==", true),
  //           limit(1)
  //         )
  //       );
  //       if (managersSnapshot.empty) {
  //         setIsAdmin(true);
  //       } else {
  //         setIsAdmin(false);
  //       }
  //       setIsNewJobAllowed(true);
  //     }
  //   } else {
  //     setIsAdmin(false);
  //     setIsNewJobAllowed(false);
  //   }
  // }

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
    <p>nice: {URLcompanyID}</p>
    // <>
    //   <Box
    //     sx={{
    //       display: "flex",
    //       flexDirection: "column",
    //       alignContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         minWidth: "500px",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       {isAdmin ? (
    //         <TextField
    //           required
    //           id="TextField-CompanyName"
    //           variant="standard"
    //           placeholder="Company name"
    //           label="Company Name"
    //           name="companyName"
    //           margin="normal"
    //           value={companyInformation.name}
    //           onChange={(e) =>
    //             setCompanyInformation({
    //               ...companyInformation,
    //               name: e.target.value,
    //             })
    //           }
    //           sx={{
    //             fontSize: "3em",
    //           }}
    //           data-cy="Textfield-CompanyName"
    //           disabled={!editMode}
    //           InputProps={{
    //             style: { fontSize: 30 },
    //             endAdornment: !editMode ? (
    //               <InputAdornment position="end">
    //                 <IconButton
    //                   onClick={handleClick}
    //                   data-cy="Button-Edit-CompanyName"
    //                 >
    //                   <Edit />
    //                 </IconButton>
    //               </InputAdornment>
    //             ) : (
    //               ""
    //             ),
    //           }}
    //         />
    //       ) : (
    //         <Typography id="TextField-Name" variant="h2" margin="normal">
    //           {companyInformation.name}
    //         </Typography>
    //       )}
    //     </Box>

    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         alignItems: "center",
    //         marginLeft: "5%",
    //       }}
    //     >
    //       {isAdmin && (
    //         <>
    //           <Typography>Modify company logo</Typography>
    //           <IconButton>
    //             <input
    //               accept="image/*"
    //               id="contained-button-file"
    //               type="file"
    //               onChange={(e) => {
    //                 if (e.target.files.length < 1) {
    //                   return;
    //                 }
    //                 uploadImage(e.target.files[0]);
    //               }}
    //             />
    //           </IconButton>
    //         </>
    //       )}
    //     </Box>

    //     <Avatar
    //       alt="Upload Image"
    //       src={companyInformation.logoPath}
    //       sx={{
    //         width: { xs: 100, sm: 150, md: 200 },
    //         height: { xs: 100, sm: 150, md: 200 },
    //       }}
    //       style={{
    //         backgroundColor: "white",
    //         border: "solid",
    //         borderColor: "#263aaf",
    //         color: "#263aaf",
    //       }}
    //     />

    //     {isAdmin && (
    //       <Button
    //         onClick={() => {
    //           saveCompanyInformation();
    //           setEditMode(false);
    //         }}
    //         data-cy="saveBtn"
    //         variant="contained"
    //         size="medium"
    //         sx={{ my: 1 }}
    //         id="Button-Save"
    //       >
    //         Save
    //       </Button>
    //     )}
    //   </Box>

    //   <Box
    //     sx={{
    //       display: "flex",
    //       flexDirection: { xs: "column", sm: "column", md: "row" },
    //       padding: "5%",
    //       alignItems: "left",
    //     }}
    //   >
    //     <Typography variant="h3" sx={{ marginRight: "2%" }}>
    //       Job List
    //     </Typography>
    //     {isNewJobAllowed && (
    //       <Link to="/createJob">
    //         <Button
    //           id="Button-NewJob"
    //           variant="contained"
    //           data-cy="Button-NewJob"
    //         >
    //           <Typography variant="h5">New Job</Typography>
    //         </Button>
    //       </Link>
    //     )}
    //   </Box>

    //   {jobs.map((job) => (
    //     <JobCard
    //       key={`JobCard-${job.documentID}`}
    //       companyID={job.companyID}
    //       companyName={companyInformation.name}
    //       jobID={job.documentID}
    //       title={job.title}
    //       city={job.city}
    //       country={job.country}
    //       deadlineSeconds={job.deadline.seconds}
    //       deadlineNanoSeconds={job.deadline.nanoseconds}
    //       logo={companyInformation.logoPath}
    //       editable={isNewJobAllowed}
    //       favoriteCompaniesID={favoriteCompaniesID}
    //       setFavoriteCompaniesID={setFavoriteCompaniesID}
    //     />
    //   ))}
    //   <Box sx={{ px: "5%" }}>
    //     <Button
    //       id="Button-Previous-Job"
    //       data-cy="Button-Previous-Job"
    //       onClick={() => getJobs(previousJobsQuery)}
    //     >
    //       <Typography variant="h6">Previous</Typography>
    //     </Button>
    //     <Button
    //       id="Button-Next-Job"
    //       data-cy="Button-Next-Job"
    //       onClick={() => getJobs(nextJobsQuery)}
    //     >
    //       <Typography variant="h6">Next</Typography>
    //     </Button>
    //   </Box>

    //   <Typography variant="h3" sx={{ padding: "5%", alignItems: "center" }}>
    //     Recruiters List
    //   </Typography>
    //   <Grid
    //     container
    //     sx={{ px: "5%" }}
    //     spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
    //   >
    //     {employees.map((employee) => (
    //       <Grid
    //         item
    //         key={`recruiterCard-${employee.ID}`}
    //         xs={12}
    //         sm={12}
    //         md={6}
    //         lg={6}
    //       >
    //         <EmployeeCard
    //           employeeId={employee.ID}
    //           employeeFirstName={employee.firstName}
    //           employeeLastName={employee.lastName}
    //           employeeImage={employee.image}
    //           employeeDescription={employee.description}
    //         >
    //           {employee.email && (
    //             <Link
    //               to={`/editProfile/${employee.firstName}${employee.lastName}`}
    //               state={{ userID: currentUserID }}
    //             >
    //               <Button>
    //                 <Typography variant="h6">View Profile </Typography>
    //               </Button>
    //             </Link>
    //           )}
    //           {isAdmin && (
    //             <>
    //               <Button
    //                 onClick={() => {
    //                   removeRecruiter(employee.ID);
    //                 }}
    //               >
    //                 <Typography variant="h6">Remove</Typography>
    //               </Button>
    //               <Button
    //                 onClick={() => {
    //                   promoteToManager(employee.ID);
    //                 }}
    //               >
    //                 <Typography variant="h6">Promote</Typography>
    //               </Button>
    //             </>
    //           )}
    //         </EmployeeCard>
    //       </Grid>
    //     ))}
    //   </Grid>

    //   <Box sx={{ px: "5%" }}>
    //     <Button
    //       id="Button-Previous-Employee"
    //       data-cy="Button-Previous-Employee"
    //       onClick={() => getEmployees(previousEmployeesQuery)}
    //     >
    //       <Typography variant="h6">Previous</Typography>
    //     </Button>
    //     <Button
    //       id="Button-Next-Employee"
    //       data-cy="Button-Next-Employee"
    //       onClick={() => getEmployees(nextEmployeesQuery)}
    //     >
    //       <Typography variant="h6">Next</Typography>
    //     </Button>
    //   </Box>
    //   <Typography variant="h3" sx={{ padding: "5%", alignItems: "center" }}>
    //     Manager List
    //   </Typography>
    //   <Grid
    //     container
    //     sx={{ px: "5%", height: "100%" }}
    //     spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
    //   >
    //     {managers.map((employee) => (
    //       <Grid
    //         item
    //         key={`managerCard-${employee.ID}`}
    //         xs={12}
    //         sm={12}
    //         md={6}
    //         lg={6}
    //       >
    //         <EmployeeCard
    //           employeeId={employee.ID}
    //           employeeFirstName={employee.firstName}
    //           employeeLastName={employee.lastName}
    //           employeeImage={employee.image}
    //           employeeDescription={employee.description}
    //         >
    //           {employee.email && (
    //             <Link
    //               to={`/editProfile/${employee.firstName}${employee.lastName}`}
    //               state={{ userID: currentUserID }}
    //             >
    //               <Button>
    //                 <Typography variant="h6">View Profile</Typography>
    //               </Button>
    //             </Link>
    //           )}
    //           {isAdmin && (
    //             <Button
    //               onClick={() => {
    //                 demoteManager(employee.ID);
    //               }}
    //             >
    //               <Typography variant="h6">Demote</Typography>
    //             </Button>
    //           )}
    //         </EmployeeCard>
    //       </Grid>
    //     ))}
    //   </Grid>

    //   <Box sx={{ px: "5%" }}>
    //     <Button
    //       id="Button-Previous-Manager"
    //       data-cy="Button-Previous-Manager"
    //       onClick={() => getManagers(previousManagersQuery)}
    //     >
    //       <Typography variant="h6">Previous</Typography>
    //     </Button>
    //     <Button
    //       id="Button-Next-Manager"
    //       data-cy="Button-Next-Manager"
    //       onClick={() => getManagers(nextManagersQuery)}
    //     >
    //       <Typography variant="h6">Next</Typography>
    //     </Button>
    //   </Box>
    // </>
  );
};

export default Company;
