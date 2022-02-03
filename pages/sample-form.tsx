import React from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";

export default function SignupForm() {
  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    initialValues: {
      email: "moo@gmail.com",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div>
      <Button variant="contained">Click Me!</Button>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
