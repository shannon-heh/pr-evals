import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Fab from "@mui/material/Fab";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { prEvalsTheme } from "../src/Helpers";
import Tooltip from "@mui/material/Tooltip";

// Creates 1. Small help button on bottom-right corner of page
// 2. Tutorial dialog that is displayed when help button is clicked
export function TutorialDialog(props: {
  dialogTitle: string;
  children: React.ReactNode;
}) {
  const [openTutorial, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Open Tutorial" arrow>
        <Fab
          size="small"
          color="secondary"
          sx={{
            margin: 0,
            top: "auto",
            right: 20,
            bottom: 20,
            left: "auto",
            position: "fixed",
            "&:hover": {
              color: prEvalsTheme.palette.secondary.main,
              backgroundColor: prEvalsTheme.palette.secondary.dark,
            },
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <QuestionMarkIcon />
        </Fab>
      </Tooltip>
      <Dialog open={openTutorial} maxWidth="sm" fullWidth>
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Creates 1. Small info button on bottom-right corner of page,
// to the left of the help button
// 2. Read me dialog that is displayed when info button is clicked
export function ReadMeDialog(props: {
  dialogTitle: string;
  children: React.ReactNode;
}) {
  const [openTutorial, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Read Me" arrow>
        <Fab
          size="small"
          color="secondary"
          sx={{
            margin: 0,
            top: "auto",
            right: 70,
            bottom: 20,
            left: "auto",
            position: "fixed",
            "&:hover": {
              color: prEvalsTheme.palette.secondary.main,
              backgroundColor: prEvalsTheme.palette.secondary.dark,
            },
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <MenuBookIcon />
        </Fab>
      </Tooltip>
      <Dialog open={openTutorial} maxWidth="sm" fullWidth>
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
