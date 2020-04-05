import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { UserProfile, UserValidation } from "../../user";
import { useValidateAfterEdited } from "../../hooks/formHooks";

const SchoolNameField: React.FC<{ value: string; valid: boolean; onChange: (value: string) => void }> = ({
  value,
  valid,
  onChange,
}) => {
  const { touch, error } = useValidateAfterEdited(valid);
  return (
    <Grid item xs={12}>
      <TextField
        required
        id="schoolName"
        name="schoolName"
        label="所属大学名"
        fullWidth
        defaultValue={value}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          touch();
        }}
      />
    </Grid>
  );
};

const DepartmentField: React.FC<{ value: string; valid: boolean; onChange: (value: string) => void }> = ({
  value,
  valid,
  onChange,
}) => {
  const { touch, error } = useValidateAfterEdited(valid);
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        required
        id="department"
        name="department"
        label="学部"
        fullWidth
        defaultValue={value}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          touch();
        }}
      />
    </Grid>
  );
};

const SubjectField: React.FC<{ value: string; valid: boolean; onChange: (value: string) => void }> = ({
  value,
  valid,
  onChange,
}) => {
  const { touch, error } = useValidateAfterEdited(valid);
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        id="subject"
        name="subject"
        label="学科"
        fullWidth
        defaultValue={value}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          touch();
        }}
      />
    </Grid>
  );
};

const StudentIDField: React.FC<{ value: string; valid: boolean; onChange: (value: string) => void }> = ({
  value,
  valid,
  onChange,
}) => {
  const { touch, error } = useValidateAfterEdited(valid);
  return (
    <Grid item xs={12}>
      <TextField
        required
        id="studentID"
        name="studentID"
        label="学籍番号 XXXXXX-X"
        fullWidth
        defaultValue={value}
        error={error}
        onBlur={(e) => {
          onChange(e.target.value);
          touch();
        }}
      />
    </Grid>
  );
};

const UniversityInfo: React.FC<{
  user: UserProfile;
  valid: UserValidation;
  onChange: (user: UserProfile) => void;
}> = ({ user, onChange, valid }) => {
  const university = user.university;
  const { name: univName, department, subject } = university;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [univName, department, subject]);
  return (
    <Grid container spacing={3}>
      <SchoolNameField
        value={user.university.name}
        valid={valid.university.name}
        onChange={(name: string) =>
          onChange({
            ...user,
            university: { ...university, name },
          })
        }
      />
      <DepartmentField
        value={user.university.department}
        valid={valid.university.department}
        onChange={(department: string) =>
          onChange({
            ...user,
            university: { ...university, department },
          })
        }
      />
      <SubjectField
        value={user.university.subject}
        valid={valid.university.subject}
        onChange={(subject: string) =>
          onChange({
            ...user,
            university: { ...university, subject },
          })
        }
      />
      <StudentIDField
        value={user.student_id}
        valid={valid.student_id}
        onChange={(value: string) =>
          onChange({
            ...user,
            student_id: value,
          })
        }
      />
    </Grid>
  );
};

export default UniversityInfo;
