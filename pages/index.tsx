import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import CustomHead from "../components/CustomHead";
import useCAS from "../hooks/useCAS";
import { useState } from "react";
import Loading from "../components/Loading";
import { Box, Button, Container, Grid, Link, Typography } from "@mui/material";

export default function Home() {
  const { isLoggedIn, isLoading, netID } = useCAS();
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);

  if (isLoading) return <Loading />;

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
            <Typography variant="h2" fontWeight={600} color="primary">
              pr.evals
            </Typography>
            <Typography variant="h5" fontWeight={500} my={4}>
              An app to preview, provide, and prepare course evaluations at
              Princeton.
            </Typography>
            <Typography
              variant="h6"
              fontStyle="italic"
              fontWeight={400}
              mt={4}
              mb={10}
            >
              A COS Independent Work project by Shannon Heh '23 and Nicholas
              Padmanabhan '23.
            </Typography>
            <Box>
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
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
