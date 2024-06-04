import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { PROPS_CONFIRMATION_DIALOG } from "../types";

const ConfirmationDialog: React.FC<PROPS_CONFIRMATION_DIALOG> = ({
  open,
  onClose,
  title,
  content,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  onDelete,
  deleteText,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          {confirmText}
        </Button>
        {onDelete && deleteText && (
          <Button onClick={onDelete} color="secondary">
            {deleteText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
