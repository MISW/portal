import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { UserProfileHooks, FormContentProps } from "../../hooks/formHooks";

const SchoolNameField: React.FC<FormContentProps<string>> = ({
  value,
  error,
  onChange,
}) => {
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
        }}
      />
    </Grid>
  );
};

const DepartmentField: React.FC<FormContentProps<string>> = ({
  value,
  error,
  onChange,
}) => {
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
        }}
      />
    </Grid>
  );
};

const SubjectField: React.FC<FormContentProps<string>> = ({
  value,
  error,
  onChange,
}) => {
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
        }}
      />
    </Grid>
  );
};

const StudentIDField: React.FC<FormContentProps<string>> = ({
  value,
  error,
  onChange,
}) => {
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
        }}
      />
    </Grid>
  );
};

const UniversityInfo: React.FC<{
  userHooks: UserProfileHooks;
}> = ({ userHooks: { univName, department, subject, studentId } }) => {
  return (
    <Grid container spacing={3}>
      <SchoolNameField {...univName} />
      <DepartmentField {...department} />
      <SubjectField {...subject} />
      <StudentIDField {...studentId} />
    </Grid>
  );
};

export default UniversityInfo;
