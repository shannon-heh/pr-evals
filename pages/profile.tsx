import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import useSWR from "swr";
import useCAS from "../hooks/useCAS";
import CustomHead from "../components/CustomHead";
import { StudentDataDB } from "../src/Types";
import { fetcher } from "../src/Helpers";
import Error from "../components/Error";
import Loading from "../components/Loading";

// capitalize first letter of string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Profile() {
  const { netID } = useCAS();

  // get user's profile data
  const url: string = netID ? `/api/get-user-data?netid=${netID}` : "";
  const { data: userData, error: userError } = useSWR(url, fetcher);

  // construct list of departments for major selection
  const { data: deptData, error: deptError } = useSWR(
    "/api/get-majors",
    fetcher
  );
  const deptItems = deptData?.majors.map((dept: string) => {
    return (
      <MenuItem key={dept} value={dept}>
        {dept}
      </MenuItem>
    );
  });

  const formik = useFormik({
    initialValues: {
      major: userData?.major_code || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // save selected major when button is clicked
      fetch(`/api/update-major?major=${values.major}`).then((res) => {
        if (res.status == 200) {
          alert(`Updated concentration to ${values.major}!`);
        } else {
          alert(
            `ERROR in updating concentration to ${values.major}. Unable to proceed with requested action.`
          );
        }
      });
    },
  });

  if (userError || deptError) return <Error text="Failed to load Profile!" />;
  if (!userData || !deptData) return <Loading text="Loading Profile..." />;

  const user = userData as StudentDataDB;
  return (
    <>
      <CustomHead pageTitle="Profile" />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item sx={{ fontWeight: "bolder" }}>
          <Typography variant="h4" id="user-name">
            {user.name}
          </Typography>
        </Grid>
        <Grid item sx={{ fontStyle: "italic", marginBottom: "1rem" }}>
          <Typography variant="h5" id="user-netid">
            {user.netid}
          </Typography>
        </Grid>
        <Grid item>
          <Typography id="user-year">Year: {user.class_year}</Typography>
        </Grid>
        <Grid item>
          <Typography id="user-type">
            Type: {capitalize(user.person_type)}
          </Typography>
        </Grid>

        <FormControl sx={{ flexDirection: "row", mt: "1rem", width: "250px" }}>
          <InputLabel id="major-input-label">Concentration</InputLabel>
          <Select
            labelId="major-input-label"
            id="user-major-select"
            name="major"
            label="Concentration"
            value={formik.values.major}
            onChange={formik.handleChange}
            sx={{ width: "75%", mr: "5px" }}
          >
            {deptItems}
            <MenuItem key="Other" value="Other">
              Other
            </MenuItem>
            <MenuItem key="None" value="None">
              None
            </MenuItem>
          </Select>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            sx={{ width: "25%" }}
          >
            Save
          </Button>
        </FormControl>
      </Grid>
    </>
  );
}
