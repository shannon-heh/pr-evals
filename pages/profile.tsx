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

// DB fields for student user
type StudentData = {
  netid: string;
  class_year: string;
  person_type: string;
  major_code: string;
  name: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// capitalize first letter of string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Profile() {
  const { isLoading, netID } = useCAS();

  // get user's profile data
  const url: string = netID ? `/api/get-user-data?netid=${netID}` : "";
  let { data: userData, error: userError } = useSWR(url, fetcher);
  if (userError) return <div>Failed to load profile page.</div>;

  // construct list of departments for major selection
  const { data: deptData, error: deptError } = useSWR(
    "/api/get-majors",
    fetcher
  );
  if (deptError) return <div>Failed to load profile page.</div>;
  const deptItems = deptData?.data.majors.map((dept) => {
    return (
      <MenuItem key={dept} value={dept}>
        {dept}
      </MenuItem>
    );
  });

  const formik = useFormik({
    initialValues: {
      major: userData?.data.major_code || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // save selected major when button is clicked
      const url = `/api/update-major?netid=${netID}&major=${values.major}`;
      fetch(url);
      alert(`Updated concentration to ${values.major}!`);
    },
  });

  if (!userData || !deptData) return <h1>Loading...</h1>;

  const user: StudentData = userData.data;
  return (
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
  );
}
