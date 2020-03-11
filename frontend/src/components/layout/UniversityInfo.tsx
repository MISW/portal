import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { UserForSignUp } from '../../user';

const UniversityInfo: React.FC<{
  user: Partial<UserForSignUp>
  onChange: (user: Partial<UserForSignUp>) => void
}> = ({ user, onChange }) => {
  const [univName, setUnivName] = useState(user.university?.name ?? '早稲田大学');
  const [department, setDepartment] = useState(user.university?.department ?? '');
  const [subject, setSubject] = useState(user.university?.subject ?? '');
  useEffect(() => {
    onChange({
      ...user,
      university: {
        name: univName,
        department, 
        subject
      }
    })
  }, [univName, department, subject]);
  return (
    <React.Fragment>
      {/* 学校名　学部 学科 学年 学籍番号 */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="schoolName"
            name="schoolName"
            label="所属大学名"
            fullWidth
            defaultValue={univName}
            onBlur={(e) => setUnivName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="departmant"
            name="department"
            label="学部"
            fullWidth
            defaultValue={department}
            onBlur={(e) => setDepartment(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="subject"
            name="subject"
            label="学科"
            fullWidth
            defaultValue={subject}
            onBlur={(e) => setSubject(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="studentID"
            name="studentID"
            label="学籍番号 XXXXXX-X"
            fullWidth
            defaultValue={user.student_id ?? ''}
            onBlur={(e) =>
              onChange({
                ...user,
                student_id: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default UniversityInfo;