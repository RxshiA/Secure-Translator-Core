import React from 'react';
import { useFormik } from 'formik';
import { TextField, Container, Typography } from '@mui/material';
import { dlManelToUnicode, singlishToUnicode, unicodeToDlManel } from "sinhala-unicode-coverter"

const Translation = () => {
  const initialValues = {
    singlishText: '',
    sinhalaText: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      // The onSubmit function is not needed for live translation.
    },
  });

  const handleSinglishInputChange = (event) => {
    const singlishText = event.target.value;
    const sinhalaText = singlishToUnicode(singlishText);
    formik.setFieldValue('singlishText', singlishText);
    formik.setFieldValue('sinhalaText', sinhalaText);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Singlish to Sinhala Translator
      </Typography>
      <form>
        <TextField
          fullWidth
          id="singlishText"
          name="singlishText"
          label="Enter Singlish Text"
          multiline
          rows={4}
          variant="outlined"
          value={formik.values.singlishText}
          onChange={handleSinglishInputChange}
        />
        <TextField
          fullWidth
          id="sinhalaText"
          name="sinhalaText"
          label="Sinhala Text"
          multiline
          rows={4}
          variant="outlined"
          value={formik.values.sinhalaText}
          readOnly
        />
      </form>
    </Container>
  );
};

export default Translation;
