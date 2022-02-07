import Button from "@mui/material/Button";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CustomHead from "../components/CustomHead";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Home() {
  const router = useRouter();
  const { ticket } = router.query;
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(`/api/auth?ticket=${ticket}`, fetcher);

  if (data && "netid" in data) {
    alert(data["netid"]);
  }

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
                onClick={() => {
                  router.push(
                    `${process.env.NEXT_PUBLIC_CAS_SERVER_URL}/login?service=${process.env.NEXT_PUBLIC_HOSTNAME}`
                  );
                }}
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
