import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CustomHead from "./CustomHead";
import ErrorIcon from "@mui/icons-material/Error";
import SvgIcon from "@mui/icons-material/Error";

export default function Error(props: { text?: string }) {
  return (
    <>
      <CustomHead pageTitle="Error" />
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
            <SvgIcon color="error" fontSize="large">
              <ErrorIcon />
            </SvgIcon>
            <h2>{props.text || "An error occurred!"}</h2>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
