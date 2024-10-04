import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Card, CardContent, Tabs, Tab, Box, Link } from '@mui/material';

function ReportDisplay({ topic, activeTab, setActiveTab, reportContentEn, reportContentVi, reportLinkEn, reportLinkVi }) {
  return (
    <Card variant="outlined" style={{ marginTop: '2rem' }}>
      <CardContent>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="English" value="en" />
          <Tab label="Vietnamese" value="vi" />
        </Tabs>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Here's your report on "{topic}":
          </Typography>
          <div style={{
            width: '100%',
            height: '300px',
            overflowY: 'scroll',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <ReactMarkdown>
              {activeTab === 'en' ? reportContentEn : reportContentVi}
            </ReactMarkdown>
          </div>
          <Typography variant="body2">
            View on GitHub Gist:{' '}
            <Link href={activeTab === 'en' ? reportLinkEn : reportLinkVi} target="_blank" rel="noopener noreferrer">
              {activeTab === 'en' ? 'English Version' : 'Vietnamese Version'}
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReportDisplay;