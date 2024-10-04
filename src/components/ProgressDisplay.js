import React from 'react';
import { Typography, Button, Card, CardContent, Box } from '@mui/material';

function ProgressDisplay({ progress, isProgressVisible, setIsProgressVisible }) {
  return (
    <Card variant="outlined" style={{ marginTop: '2rem' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Button onClick={() => setIsProgressVisible(!isProgressVisible)}>
            {isProgressVisible ? 'Hide Progress ▲' : 'Show Progress ▼'}
          </Button>
        </Typography>
        {isProgressVisible && (
          <Box mt={2}>
            <textarea
              value={progress.join('\n')}
              readOnly
              style={{
                width: '100%',
                height: '300px',
                overflowY: 'scroll',
                resize: 'none',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default ProgressDisplay;