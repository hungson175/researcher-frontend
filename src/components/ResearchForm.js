import React from 'react';
import { Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';

function ResearchForm({ topic, setTopic, placeholder, isGenerating, handleSubmit }) {
  return (
    <Card variant="outlined" style={{ marginTop: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Write a research paper about:
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder}
            disabled={isGenerating}
            variant="outlined"
            style={{ marginBottom: '1rem' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isGenerating}
            startIcon={isGenerating && <CircularProgress size={20} color="inherit" />}
          >
            {isGenerating ? 'Generating report...' : 'Generate Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ResearchForm;