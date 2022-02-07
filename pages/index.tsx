import Button from "@mui/material/Button";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import CustomHead from "../components/CustomHead";
import useCAS from "../hooks/useCAS";

export default function Home() {
  const { isLoggedIn, isLoading, netID } = useCAS();

  if (isLoggedIn) {
    console.log("TODO: now logged in, so redirect to somewhere");
  }

  if (isLoading)
    return (
      <>
        <CustomHead pageTitle="Loading" />
        <Container maxWidth={false}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3} sx={{ textAlign: "center" }}>
              <CircularProgress />
              <h2>Loading...</h2>
            </Grid>
          </Grid>
        </Container>
      </>
    );

  return (
    <>
      <CustomHead pageTitle="Login" />
      <Container maxWidth={false}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <h1>Course Evaluations IW</h1>
            <i>
              An app to facilitate and publish course evaluations at Princeton.
            </i>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isLoggedIn ? null : <LoginRoundedIcon fontSize="large" />
                }
                href={`${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/login?service=${process.env.NEXT_PUBLIC_HOSTNAME}`}
                disabled={isLoggedIn}
              >
                {isLoggedIn ? `Logged in as ${netID}` : "Login with CAS"}
              </Button>
            </Box>
            {/* TODO: Move logout button to navbar */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  !isLoggedIn ? null : <LogoutRoundedIcon fontSize="large" />
                }
                href="/logout"
                disabled={!isLoggedIn}
              >
                Log out
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
