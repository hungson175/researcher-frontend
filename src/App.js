import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, 
  Box, ThemeProvider, createTheme
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useResearchReport } from './hooks/useResearchReport';
import ResearchForm from './components/ResearchForm';
import ProgressDisplay from './components/ProgressDisplay';
import ReportDisplay from './components/ReportDisplay';

const theme = createTheme({
  typography: {
    fontFamily: 'Arial, sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  palette: {
    primary: {
      main: '#3f51b5',
    },
  },
});

function App() {
  const {
    topic,
    setTopic,
    progress,
    isProgressVisible,
    setIsProgressVisible,
    reportLinkEn,
    reportLinkVi,
    isGenerating,
    isReportVisible,
    reportContentEn,
    reportContentVi,
    remainingCredits,
    handleSubmit
  } = useResearchReport();

  const [placeholder, setPlaceholder] = useState('Generative AI impact on Software Development');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('en');

  useEffect(() => {
    const placeholders = [
      'Generative AI impact on Software Development',
      '3 days guide for traveller: Nha Trang',
      'The future of renewable energy',
      'Impact of social media on mental health'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % placeholders.length;
      setPlaceholder(placeholders[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    setUser({ name: "Google User" });
  };

  const handleSignIn = () => {
    window.google.accounts.id.prompt();
  };

  const handleSignOut = () => {
    setUser(null);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, color: '#3f51b5', fontWeight: 'bold' }}>
              SonPH AI
            </Typography>
            <Button color="primary">Sign in</Button>
            <Button color="primary" variant="outlined" style={{ marginLeft: '1rem' }}>
              Sign-up for Free
            </Button>
          </Toolbar>
        </AppBar>

        <Box my={4}>
          <Typography variant="h4" gutterBottom align="center" style={{ color: '#3f51b5' }}>
            Researcher at your fingertips
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <VerifiedUserIcon fontSize="small" style={{ marginRight: '0.5rem', color: '#666' }} />
            <Typography variant="subtitle1" style={{ color: '#666', marginRight: '1rem' }}>
              100% reliable with refs
            </Typography>
            <VisibilityOffIcon fontSize="small" style={{ marginRight: '0.5rem', color: '#666' }} />
            <Typography variant="subtitle1" style={{ color: '#666' }}>
              Bypass AI detection
            </Typography>
          </Box>

          <ResearchForm
            topic={topic}
            setTopic={setTopic}
            placeholder={placeholder}
            isGenerating={isGenerating}
            handleSubmit={handleSubmit}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="text" color="primary">
              Request More Credits
            </Button>
            <Typography variant="body2" color="textSecondary">
              Remaining credits: {remainingCredits}
            </Typography>
          </Box>

          {progress.length > 0 && (
            <ProgressDisplay
              progress={progress}
              isProgressVisible={isProgressVisible}
              setIsProgressVisible={setIsProgressVisible}
            />
          )}

          {isReportVisible && (
            <ReportDisplay
              topic={topic}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reportContentEn={reportContentEn}
              reportContentVi={reportContentVi}
              reportLinkEn={reportLinkEn}
              reportLinkVi={reportLinkVi}
            />
          )}
        </Box>

        <Box mt={4} mb={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Trusted by me, from AI with love :)
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;