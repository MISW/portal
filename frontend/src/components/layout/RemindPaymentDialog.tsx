import React from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

type Props = {
  open: boolean;
  targetUsers: { id: number; description: string }[];
  onClose: (value: "OK" | "Cancel") => void;
};

const RemindPaymentDialog: React.FC<Props> = (props) => {
  const { onClose, targetUsers, open } = props;

  return (
    <Dialog
      disableBackdropClick
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
