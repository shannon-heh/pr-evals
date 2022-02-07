import Button from "@mui/material/Button";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import CustomHead from "../components/CustomHead";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Home() {
  const router = useRouter();
  const { ticket } = router.query;
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(`/api/auth?ticket=${ticket}`, fetcher);
  let loggedIn: boolean = !error && data && "netid" in data;

  if (loggedIn) {
    console.log("TODO: now logged in, so redirect to somewhere");
  }

  if (!data)
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
                  loggedIn ? null : <LoginRoundedIcon fontSize="large" />
                }
                href={`${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/login?service=${process.env.NEXT_PUBLIC_HOSTNAME}`}
                disabled={loggedIn}
              >
                {loggedIn ? `Logged in as ${data["netid"]}` : "Login with CAS"}
              </Button>
            </Box>
            {/* TODO: Move logout button to navbar */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  !loggedIn ? null : <LogoutRoundedIcon fontSize="large" />
                }
                href="/logout"
                disabled={!loggedIn}
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
