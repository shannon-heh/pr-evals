import CustomHead from "./CustomHead";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SvgIconCheck from "@mui/icons-material/CheckCircle";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ErrorIcon from "@mui/icons-material/Error";
import SvgIconError from "@mui/icons-material/Error";

// A friendlier way to block certain user actions
export default function BlockAction(props: {
  pageTitle: string;
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <>
      <CustomHead pageTitle={props.pageTitle} />
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
            {props.error ? (
              <SvgIconError color="error" fontSize="large">
                <ErrorIcon />
              </SvgIconError>
            ) : (
              <SvgIconCheck color="success" fontSize="large">
                <CheckCircleIcon />
              </SvgIconCheck>
            )}
            <h2>{props.children}</h2>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
