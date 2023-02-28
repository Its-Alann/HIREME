/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as EmailValidator from "email-validator";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import useSignUp from "./useSignUp";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    background: { main: "#EAEAEA" },
    gray: { main: "#757575" },
  },
  typography: {
    fontFamily: ["Proxima Nova"],
  },
});

const SignUp = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const { signup, isPending, error } = useSignUp();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { email, password, name } = {
      email: data.get("email"),
      password: data.get("password"),
      name: data.get("firstName"),
    };

    signup(email, password, name);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* <Navbar /> */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
            data-cy="formTest"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  data-cy="firstNameTest"
                  autoFocus
                  onBlur={(e) => {
                    setFirstNameError(
                      e.target.value === ""
                        ? false
                        : !/^[a-zA-Z]+$/.test(e.target.value)
                    );
                  }}
                  error={firstNameError}
                  helperText={
                    !firstNameError
                      ? ""
                      : "Please enter a valid name (letters only)"
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  data-cy="lastNameTest"
                  onBlur={(e) => {
                    setLastNameError(
                      e.target.value === ""
                        ? false
                        : !/^[a-zA-Z]+$/.test(e.target.value)
                    );
                  }}
                  error={lastNameError}
                  helperText={
                    !lastNameError
                      ? ""
                      : "Please enter a valid name (letters only)"
                  }
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  data-cy="emailTest"
                  autoComplete="email"
                  onBlur={(e) => {
                    setEmailError(
                      e.target.value === ""
                        ? false
                        : !EmailValidator.validate(e.target.value)
                    );
                  }}
                  error={emailError}
                  helperText={!emailError ? "" : "Please enter a valid email"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  data-cy="passwordTest"
                  autoComplete="new-password"
                  onBlur={(e) => {
                    setPasswordError(
                      e.target.value === ""
                        ? false
                        : !e.target.value.match(
                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
                          )
                    );
                  }}
                  error={passwordError}
                  helperText={
                    !passwordError
                      ? ""
                      : "Please enter a password of six characters with, at least one letter, one number and one special character"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                  name="updates"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
