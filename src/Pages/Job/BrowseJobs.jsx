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
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
// import JobPostingApplicants from "../Recruiter/JobPostingApplicants";
import { Link } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import "./Job.css";

export const BrowseJobs = () => {
  const [jobs, setJobs] = React.useState([]);
  const [lastJob, setLastJob] = React.useState(null);
  const [firstJob, setFirstJob] = React.useState(null);
  const [companiesName, setCompaniesName] = React.useState({});

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
          // Anti eslint
          const hello = "hello";

          // do this to show what is inside job
          // console.log(job);
          return (
            // Create cards instead
            <Box key={job.documentID} sx={{ py: 1 }}>
              <Card variant="outlined">
                <Box sx={{ m: 3 }}>
                  <Typography variant="h4">{job.title}</Typography>

                  <Typography>{companiesName[job.companyID]}</Typography>

                  {/* change to country and city */}
                  <Typography>{job.location}</Typography>

                  {/* do we need to show company id? */}
                  {/* <Typography>Company ID: {job.companyID}</Typography> */}

                  {/* <Typography>
                    Published At:{" "}
                    {new Date(
                      job.publishedAt.seconds * 1000 +
                        job.publishedAt.nanoseconds / 1000000
                    ).toDateString()}
                  </Typography> */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    sx={{ pt: 2 }}
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{ my: 1 }}
                      id={`Button-${job.documentID}`}
                    >
                      <Link
                        to={`/viewJobPostingApplicants/${job.companyID}/${job.documentID}`}
                        className="link"
                        underline="none"
                        style={{ textDecoration: "none" }}
                      >
                        {/* <Link to="/job/1"> */}
                        View job (redirects to recruiter&apos;s view)
                      </Link>
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
