/* eslint-disable react/jsx-props-no-spreading */
import {
  doc,
  collection,
  addDoc,
  setDoc,
  getFirestore,
} from "firebase/firestore";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NameForm from "./Forms/NameForm";
import ContactInfo from "./Forms/ContactInfo";
import Education from "./Forms/Education";
import Experience from "./Forms/Experience";
import Languages from "./Forms/Languages";
import Projects from "./Forms/Projects";
import Skills from "./Forms/Skills";
import Volunteering from "./Forms/Volunteering";
import Awards from "./Forms/Awards";
import "./AccountCreation.css";
import { auth, app } from "../../Firebase/firebase";

const db = getFirestore(app);

const steps = [
  "Name",
  "Contact Information",
  "Education",
  "Experience",
  "Skills",
  "Languages",
  "Projects",
  "Volunteering",
  "Awards",
];

const AccountCreation = () => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [dob, setDob] = React.useState(null);

  const [school, setSchool] = React.useState("");
  const [degree, setDegree] = React.useState("");
  const [program, setProgram] = React.useState("");
  const [startDateEdu, setStartDateEdu] = React.useState(null);
  const [endDateEdu, setEndDateEdu] = React.useState(null);
  const [courses, setCourses] = React.useState("");

  const [company, setCompany] = React.useState("");
  const [jobPosition, setjobPosition] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startDateExp, setStartDateExp] = React.useState(null);
  const [endDateExp, setEndDateExp] = React.useState(null);
  const [workingHere, setWorkingHere] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const [skills, setSkills] = React.useState("");

  const [language, setLanguage] = React.useState("");
  const [proficiency, setProficiency] = React.useState("");

  const [project, setProject] = React.useState("");
  const [projectDesc, setProjectDesc] = React.useState("");

  const [organization, setOrganization] = React.useState("");
  const [dateVolunt, setDateVolunt] = React.useState(null);
  const [voluntDesc, setVoluntDesc] = React.useState("");

  const [awardTitle, setAwardTitle] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [dateAward, setDateAward] = React.useState(null);
  const [awardDesc, setAwardDesc] = React.useState("");

  const values = {
    firstName,
    lastName,
    phoneNumber,
    address,
    city,
    country,
    postalCode,
    dob,
    school,
    degree,
    program,
    startDateEdu,
    endDateEdu,
    courses,
    company,
    jobPosition,
    location,
    startDateExp,
    endDateExp,
    workingHere,
    description,
    skills,
    language,
    proficiency,
    project,
    projectDesc,
    organization,
    dateVolunt,
    voluntDesc,
    awardTitle,
    issuer,
    dateAward,
    awardDesc,
  };

  const forms = [
    <NameForm
      setFirstName={setFirstName}
      setLastName={setLastName}
      values={values}
    />,
    <ContactInfo
      setPhoneNumber={setPhoneNumber}
      setAddress={setAddress}
      setCity={setCity}
      setCountry={setCountry}
      setPostalCode={setPostalCode}
      setDob={setDob}
      values={values}
    />,
    <Education
      setSchool={setSchool}
      setDegree={setDegree}
      setProgram={setProgram}
      setStartDateEdu={setStartDateEdu}
      setEndDateEdu={setEndDateEdu}
      setCourses={setCourses}
      values={values}
    />,
    <Experience
      setCompany={setCompany}
      setjobPosition={setjobPosition}
      setLocation={setLocation}
      setStartDateExp={setStartDateExp}
      setEndDateExp={setEndDateExp}
      setWorkingHere={setWorkingHere}
      setDescription={setDescription}
      values={values}
    />,
    <Skills setSkills={setSkills} values={values} />,
    <Languages
      setLanguage={setLanguage}
      setProficiency={setProficiency}
      values={values}
    />,
    <Projects
      setProject={setProject}
      setProjectDesc={setProjectDesc}
      values={values}
    />,
    <Volunteering
      setOrganization={setOrganization}
      setDateVolunt={setDateVolunt}
      setVoluntDesc={setVoluntDesc}
      values={values}
    />,
    <Awards
      setAwardTitle={setAwardTitle}
      setIssuer={setIssuer}
      setDateAward={setDateAward}
      setAwardDesc={setAwardDesc}
      values={values}
    />,
  ];

  const [activeStep, setActiveStep] = React.useState(8);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => step === null;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // console.log(JSON.stringify(values));
    try {
      const userProfiles = doc(collection(db, "userProfiles"));
      await setDoc(userProfiles, values);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinalSubmit = () => {
    handleSubmit();
    handleNext();
  };

  return (
    <Box className="AccountCreation">
      <div id="content">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography style={{ color: "black" }} sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              style={{ color: "black" }}
              sx={{ mt: 2, mb: 1 }}
              textAlign="center"
            >
              {steps[activeStep]} {forms[activeStep]}{" "}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                style={{ color: "black" }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}

              <Button
                onClick={
                  activeStep === steps.length - 1
                    ? handleFinalSubmit
                    : handleNext
                }
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </div>
    </Box>
  );
};

export default AccountCreation;
