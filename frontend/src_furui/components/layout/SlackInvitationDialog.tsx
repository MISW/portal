import React from "../src_furui/react";
import Button from "../src_furui/@material-ui/core/Button";
import List from "../src_furui/@material-ui/core/List";
import ListItem from "../src_furui/@material-ui/core/ListItem";
import ListItemText from "../src_furui/@material-ui/core/ListItemText";
import DialogTitle from "../src_furui/@material-ui/core/DialogTitle";
import DialogContent from "../src_furui/@material-ui/core/DialogContent";
import DialogActions from "../src_furui/@material-ui/core/DialogActions";
import Dialog from "../src_furui/@material-ui/core/Dialog";

type Props = {
  open: boolean;
  invitedUsers: { id: number; description: string }[];
  onClose: (value: "OK" | "Cancel") => void;
};

const SlackInvitationDialog: React.FC<Props> = (props) => {
  const { onClose, invitedUsers, open } = props;

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="confirm-slack-invitation-dialog"
      open={open}
    >
      <DialogTitle id="confirm-slack-invitation-dialog-title">
        以下のメンバーをSlackに招待します(予定)
      </DialogTitle>
      <DialogContent dividers>
        <List component="nav" aria-label="members to be invited">
          {invitedUsers.length === 0
            ? "なし"
            : invitedUsers.map((user) => (
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
          disabled={invitedUsers.length === 0}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SlackInvitationDialog;
