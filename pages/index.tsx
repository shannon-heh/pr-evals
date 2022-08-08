import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import CustomHead from "../components/CustomHead";
import useCAS from "../hooks/useCAS";
import { useState } from "react";
import Loading from "../components/Loading";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

export default function Home() {
  const { isLoggedIn, isLoading, netID } = useCAS();
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);

  if (isLoading || isLoggedIn) return <Loading />;

  return (
    <>
      <CustomHead pageTitle="Login" />
      <Container maxWidth="md">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 10 }}
        >
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <Typography variant="h2" fontWeight={600} color="secondary">
              pr.evals
            </Typography>
            <Typography variant="h5" fontWeight={500} my={4}>
              An app to prepare, provide, and preview course evaluations at
              Princeton.
            </Typography>
            <Typography fontSize={18} lineHeight={2} fontWeight={400} my={4}>
              A COS Independent Work project by Shannon Heh '23 and Nicholas
              Padmanabhan '23.
              <br />
              Advised by Professor David Walker.
            </Typography>
            <Typography fontSize={18} lineHeight={2} fontWeight={400} my={4}>
              Codebase and links to our papers are in{" "}
              <a
                href="https://github.com/shannon-heh/pr-evals"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              !
            </Typography>
            <Box>
              <Button
                color="info"
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
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
