import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
} from "firebase/firestore";
import Container from "@mui/material/Container";
import { db } from "../../Firebase/firebase";
import "./Job.css";
import JobCard from "../../Components/Jobs/JobCard";

export const BrowseJobs = () => {
  const [jobs, setJobs] = React.useState([]);
  const [lastJob, setLastJob] = React.useState(null);
  const [firstJob, setFirstJob] = React.useState(null);
  const [companiesName, setCompaniesName] = React.useState({});
  const [companiesLogo, setCompaniesLogo] = React.useState({});

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
    collection(db, "jobs"),
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
    collection(db, "jobs"),
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
    collection(db, "jobs"),
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
    jobs.forEach(async (job) => {
      if (!temp[job.companyID]) {
        temp[job.companyID] = "querying";
        const companyRef = doc(db, "companies", job.companyID);
        const companySnapshot = await getDoc(companyRef);
        temp[job.companyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
    });
  }

  // Load the logo of each company that has job listings
  function loadLogoCompany() {
    const temp = companiesLogo;
    jobs.forEach(async (job) => {
      const querySnapshot = await getDoc(doc(db, "companies", job.companyID));
      temp[job.companyID] = querySnapshot.data().logoPath;
      // triggers a re-render and display the newly loaded logos
      setCompaniesLogo({ ...temp });
    });
  }

  React.useEffect(() => {
    getCompaniesName();
    loadLogoCompany();
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

        {jobs.map((job) => (
          <JobCard
            key={`JobCard-${job.documentID}`}
            companyID={job.companyID}
            companyName={companiesName[job.companyID]}
            jobID={job.documentID}
            title={job.title}
            city={job.city}
            country={job.country}
            deadlineSeconds={job.deadline.seconds}
            deadlineNanoSeconds={job.deadline.nanoseconds}
            logo={companiesLogo[job.companyID]}
          />
        ))}
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
