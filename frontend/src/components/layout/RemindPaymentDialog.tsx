import React from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

type Props = {
  open: boolean;
  targetUsers: { id: number; description: string }[];
  onClose: (value: "OK" | "Cancel") => void;
};

const RemindPaymentDialog: React.FC<Props> = (props) => {
  const { onClose, targetUsers, open } = props;

  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="confirm-slack-invitation-dialog"
      open={open}
    >
      <DialogTitle id="confirm-slack-invitation-dialog-title">
        以下のメンバーにメールを送信します(予定)
      </DialogTitle>
      <DialogContent dividers>
        <List component="nav" aria-label="members to be invited">
          {targetUsers.length === 0
            ? "なし"
            : targetUsers.map((user) => (
                <ListItem button key={user.id}>
                  <ListItemText primary={user.description} />
                </ListItem>
              ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose("Cancel")} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => onClose("OK")}
          color="primary"
          disabled={targetUsers.length === 0}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemindPaymentDialog;
