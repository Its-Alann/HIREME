import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { getDoc, doc } from "firebase/firestore";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import SignInGoogleButton from "../../Components/SignInGoogleButton/SignInGoogleButton";
import { auth, provider, db } from "../../Firebase/firebase";

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
  const [blockedUser, setBlockedUser] = React.useState(false);

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

      const docRef = doc(db, "blockedUsers", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() === false) {
        signInWithEmailAndPassword(email, password);
        navigate("/");
      } else {
        setBlockedUser(true);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
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
              helperText={!emailError ? "" : t("Pleaseentervalidcredentials")}
              variant="standard"
              color="primary"
              onChange={() => setBlockedUser(false)}
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
            />

            {error && <Typography color="error">{error.message}</Typography>}

            {blockedUser ? (
              <Typography color="error">
                {t("Your account has been banned")}
              </Typography>
            ) : (
              ""
            )}

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
              >
                {t("SignIn")}
              </Button>
            )}

            <Stack justifyContent="center" spacing={1}>
              <Link
                align="center"
                href="/resetPassword"
                variant="subtitle2"
                data-testid="forgotPassword"
              >
                {t("ForgotPassword")}?
              </Link>
            </Stack>
            <Stack justifyContent="center" spacing={0} sx={{ mt: 3 }}>
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
                {t("Sign Up")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
