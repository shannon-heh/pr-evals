import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CustomHead from "../components/CustomHead";
import useCAS from "../hooks/useCAS";
import { useState } from "react";
import Loading from "../components/Loading";
import { Box, Button, Container, Grid, Link } from "@mui/material";

export default function Home() {
  const { isLoggedIn, isLoading, netID } = useCAS();
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);

  if (isLoading) return <Loading />;

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
                onClick={() => setLoginButtonDisabled(true)}
                disabled={isLoggedIn || loginButtonDisabled}
              >
                {isLoggedIn ? `Logged in as ${netID}` : "Login with CAS"}
              </Button>
            </Box>
            {/* TODO: @shannon-heh Move logout button to navbar and delete from this file */}
            <Box sx={{ mt: 4 }}>
              <Link href="/logout">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LogoutRoundedIcon fontSize="large" />}
                >
                  Log out
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
