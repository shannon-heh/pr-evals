import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function Charts() {
  return (
    <Grid container sx={{ textAlign: "center" }}>
      <Grid item container lg={6} direction="column">
        col1
      </Grid>
      <Grid item container lg={6} direction="column">
        col2
      </Grid>
    </Grid>
  );
}
