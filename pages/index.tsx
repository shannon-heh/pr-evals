import Button from "@mui/material/Button";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CustomHead from "../components/CustomHead";

export default function Home() {
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
                startIcon={<LoginRoundedIcon fontSize="large" />}
              >
                Login with CAS
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
