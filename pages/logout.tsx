import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import CustomHead from "../components/CustomHead";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Logout() {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/logout", fetcher);
  let loggedOut: boolean = !error && data;

  if (loggedOut) router.push("/");

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
            <h2>Logging out...</h2>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
