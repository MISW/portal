import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function UniversityInfo() {
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
            value="早稲田大学"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="departmant"
            name="department"
            label="学部"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="subject"
            name="subject"
            label="学科"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="studentID"
            name="studentID"
            label="学籍番号 XXXXXX-X"
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}