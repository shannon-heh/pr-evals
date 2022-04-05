import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmationDialog(props: {
  title: string;
  isOpen: boolean;
  children?: React.ReactNode;
  closeDialog;
  handleSubmit;
}) {
  return (
    <Dialog
      open={props.isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeDialog} autoFocus>
          Cancel
        </Button>
        <Button onClick={props.handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
