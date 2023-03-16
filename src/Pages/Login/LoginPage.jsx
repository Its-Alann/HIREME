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
import { CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import SignInGoogleButton from "../../Components/SignInGoogleButton/SignInGoogleButton";
import { auth, provider } from "../../Firebase/firebase";
import Navbar from "../../Components/Navbar/Navbar";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [authError, setAuthError] = React.useState(false);
  const [authErrorMsg, setAuthErrorMsg] = React.useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const { t, i18n } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!emailError && email && password) {
      console.log({
        email,
        password,
      });
      try {
        signInWithEmailAndPassword(email, password);
        navigate("/");
      } catch (err) {
        console.error(err.code, err.message);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
          }}
        >
          <Typography component="h1" variant="h5" color="primary">
            HIRE<em>ME</em> {t("accountSignIn")}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            data-cy="formTest"
          >
            <TextField
              className="TextField"
              type="text"
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("EmailAddress")}
              name="email"
              autoComplete="email"
              autoFocus
              data-cy="emailTest"
              inputProps={{
                "aria-label": "email",
              }}
              onBlur={(e) => {
                setEmailError(
                  e.target.value === ""
                    ? false
                    : !EmailValidator.validate(e.target.value)
                );
              }}
              error={emailError}
              helperText={!emailError ? "" : "Please enter valid credentials"}
              variant="standard"
              color="primary"
            />
            <TextField
              className="TextField"
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("Password")}
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
              color="primary"
              onFocus={() => setAuthErrorMsg("")}
            />
            <Typography color={theme.palette.error.main}>
              {authError && authErrorMsg}
            </Typography>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1 }}
                color="primary"
                name="signIn"
                inputProps={{ "aria-label": "signIn" }}
              >
                {t("SignIn")}
              </Button>
            )}
            {error && <Typography color="red">{error}</Typography>}
            <Stack container justifyContent="center" spacing={1}>
              <Link item xs align="center" href="/" variant="subtitle2">
                {t("ForgotPassword")}
              </Link>
            </Stack>
            <Stack container justifyContent="center" spacing={0} sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                align="center"
                color="gray"
                sx={{ fontSize: ".9rem" }}
              >
                {t("AlternativeSignIn")}
              </Typography>
              {/* eslint-disable-next-line*/}
              <div align="center">
                <SignInGoogleButton sx={{ m: "auto" }} data-cy="GoogleTest" />
              </div>
            </Stack>
            <Stack
              sx={{ pt: 4 }}
              spacing={1}
              container
              justifyContent="center"
              alignItems="center"
            >
              <Typography color="primary">{t("NoAccount")}</Typography>
              <Button
                href="/SignUp"
                variant="outlined"
                fullWidth
                color="primary"
                sx={{ mt: 3, mb: 2, py: 1 }}
              >
                {t("SignUp")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
