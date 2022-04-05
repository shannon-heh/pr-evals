import { CircularProgress, Container, Grid } from "@mui/material";
import CustomHead from "./CustomHead";

export default function Loading(props: { text?: string }) {
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
            <CircularProgress color="secondary" />
            <h2>{props.text || "Loading..."}</h2>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
