import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import {
  doc,
  collection,
  getDoc,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
import Stack from "@mui/material/Stack";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../Firebase/firebase";

export const ViewCompany = () => {
  const { companyID } = useParams();
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
    logoPath: "", // new state for the uploaded logo file
    jobs: [],
  });
  const [employeesInformation, setEmployeesInformation] = React.useState([]);
  const [managersInformation, setManagersInformation] = React.useState([]);

  async function getCompanyInformation() {
    const companyRef = doc(db, "companies", companyID);
    const companySnapshot = await getDoc(companyRef);
    if (companySnapshot.exists()) {
      setCompanyInformation(companySnapshot.data());
    }
  }

  async function getEmployees() {
    if (companyInformation.employees.length > 0) {
      const recruitersRef = collection(db, "recruiters");
      const employeesQuery = query(
        recruitersRef,
        where(documentId(), "in", companyInformation.employees)
      );
      const querySnapshot = await getDocs(employeesQuery);
      const temp = [];
      querySnapshot.forEach((document) => {
        temp.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
        });
      });
      setEmployeesInformation(temp);
    } else {
      setEmployeesInformation([]);
    }
  }

  async function getManagers() {
    if (companyInformation.managers.length > 0) {
      const recruitersRef = collection(db, "recruiters");
      const employeesQuery = query(
        recruitersRef,
        where(documentId(), "in", companyInformation.managers)
      );
      const querySnapshot = await getDocs(employeesQuery);
      const temp = [];
      querySnapshot.forEach((document) => {
        temp.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
        });
      });
      setManagersInformation(temp);
    } else {
      setManagersInformation([]);
    }
  }

  React.useEffect(() => {
    getCompanyInformation();
  }, []);

  React.useEffect(() => {
    console.log(companyInformation);
    if (companyInformation.employees) {
      getEmployees();
    }
    if (companyInformation.managers) {
      getManagers();
    }
  }, [companyInformation]);

  return (
    <>
      <Typography variant="h4" sx={{ pb: 2 }}>
        View Company
      </Typography>
      <Typography>Company Name</Typography>
      <Typography>{companyInformation.name}</Typography>
      <Typography>Company Logo</Typography>
      <Box
        component="img"
        sx={{
          // objectFit: "cover",
          width: "6rem",
          height: "6rem",
          mr: 2,
        }}
        src={companyInformation.logoPath}
      />
      <Typography>Has {companyInformation.jobs.length} Jobs</Typography>

      <Typography>Employee List</Typography>
      {employeesInformation.map((employeeInformation) => (
        <div key={`employeeCard-${employeeInformation.ID}`}>
          <Typography>{employeeInformation.ID}</Typography>
          <Typography>{employeeInformation.firstName}</Typography>
          <Typography>{employeeInformation.lastName}</Typography>
        </div>
      ))}

      <Typography>Manager List</Typography>
      {managersInformation.map((manager) => (
        <div key={`managerCard-${manager.ID}`}>
          <Typography>{manager.ID}</Typography>
          <Typography>{manager.firstName}</Typography>
          <Typography>{manager.lastName}</Typography>
        </div>
      ))}
    </>
  );
};
export default ViewCompany;
