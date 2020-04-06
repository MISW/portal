import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useValidateAfterEdited, UserValidation, SetUserProfileFuncs } from "../../hooks/formHooks";
import { UserProfile } from "../../user";

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
  setFuncs: SetUserProfileFuncs;
}> = ({ user ,setFuncs: {setUnivName, setDepartment, setSubject, setStudentId}, valid }) => {
  const { name: univName, department, subject } = user.university;
  return (
    <Grid container spacing={3}>
      <SchoolNameField
        value={univName}
        valid={valid.university.name}
        onChange={setUnivName}
      />
      <DepartmentField
        value={department}
        valid={valid.university.department}
        onChange={setDepartment}
      />
      <SubjectField
        value={subject}
        valid={valid.university.subject}
        onChange={setSubject}
      />
      <StudentIDField
        value={user.studentId}
        valid={valid.studentId}
        onChange={setStudentId}
      />
    </Grid>
  );
};

export default UniversityInfo;
