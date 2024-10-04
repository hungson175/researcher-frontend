import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  AppBar, Toolbar, Typography, Button, TextField, Container, 
  Box, Card, CardContent, Tabs, Tab, CircularProgress,
  Link
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

// const WEBSOCKET_REPORT_API_URL = 'wss://researcher-backend.onrender.com/genreport';
const WEBSOCKET_REPORT_API_URL = process.env.REACT_APP_WEBSOCKET_REPORT_API_URL || 'wss://researcher-backend.onrender.com/genreport';

function App() {
  const [topic, setTopic] = useState('');
  const [placeholder, setPlaceholder] = useState('Generative AI impact on Software Development');
  const [progress, setProgress] = useState([]);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  const websocketRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reportLinkEn, setReportLinkEn] = useState('');
  const [reportLinkVi, setReportLinkVi] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportContentEn, setReportContentEn] = useState('');
  const [reportContentVi, setReportContentVi] = useState('');
  const [activeTab, setActiveTab] = useState('en');
  const [remainingCredits, setRemainingCredits] = useState(4);

  const connectWebSocket = () => {
    if (isConnecting) return;

    setIsConnecting(true);
    const ws = new WebSocket(WEBSOCKET_REPORT_API_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWebsocket(ws);
      setIsConnecting(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if ('success' in message) {
          // This is the final result
          if (message.success) {
            setReportContentEn(message.en_content);
            setReportContentVi(message.vi_content);
            setReportLinkEn(message.published_url_en);
            setReportLinkVi(message.published_url_vi);
            setProgress(prev => [
              ...prev, 
              'English report uploaded successfully to GitHub Gist',
              'Vietnamese report uploaded successfully to GitHub Gist'
            ]);
            setIsReportVisible(true);
          } else {
            setProgress(prev => [...prev, `Error: ${message.message}`]);
          }
          setIsGenerating(false);
        } else {
          // Existing progress handling
          const content = message.output || message;

          if (typeof content === 'string') {
            setProgress(prev => [...prev, content]);
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        setIsGenerating(false);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWebsocket(null);
      setIsConnecting(false);
      setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    websocketRef.current = ws;
  };

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

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const handleCredentialResponse = (response) => {
    // Handle the encrypted JWT token
    console.log("Encoded JWT ID token: " + response.credential);
    // Here you would typically send this token to your backend for verification
    // and then set the user state based on the verified information
    console.log("Credential response: " + response);
    setUser({ name: "Google User" }); // Placeholder, replace with actual user info
  };

  const handleSignIn = () => {
    window.google.accounts.id.prompt();
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProgress([]);  // Clear old progress
    setIsProgressVisible(true);
    setIsGenerating(true);  // Disable the button
    setReportLinkEn('');  // Clear old links
    setReportLinkVi('');
    setIsReportVisible(false);

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const request = {
        query: topic,
        report_type: "research_report",
        report_source: "web_search"
      };
      websocket.send(JSON.stringify(request));
      setProgress(['Initiating research process...']);
    } else {
      setProgress(['Error: WebSocket connection not available. Attempting to reconnect...']);
      connectWebSocket();
    }
  };

  useEffect(() => {
    // Load Google Identity Services script
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

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="text" color="primary">
              Request More Credits
            </Button>
            <Typography variant="body2" color="textSecondary">
              Remaining credits: {remainingCredits}
            </Typography>
          </Box>

          {progress.length > 0 && (
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
          )}

          {isReportVisible && (
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