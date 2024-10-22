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
import { Navigate, useNavigate, redirect } from "react-router-dom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import Navbar from "../../Components/Navbar/Navbar";
import { auth } from "../../Firebase/firebase";

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

const SignUpPage = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { email, password, name } = {
      email: data.get("email"),
      password: data.get("password"),
      name: data.get("firstName"),
    };

    createUserWithEmailAndPassword(email, password, name);
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
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
            {t("SignUp")}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
            data-cy="formTest"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("EmailAddress")}
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
                  helperText={!emailError ? "" : t("Pleaseenteravalidemail")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={t("Password")}
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
                      : t(
                          "Pleaseenterapasswordofsixcharacterswith,atleastoneletter,onenumberandonespecialcharacter"
                        )
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label={t("Newsletter")}
                  name="updates"
                />
              </Grid>
            </Grid>

            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                id="submitBtn"
                sx={{ mt: 3, mb: 2 }}
              >
                {t("SignUp")}
              </Button>
            )}
            {error && <Typography color="red">{error}</Typography>}

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  {t("AlreadySignedUp")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUpPage;
