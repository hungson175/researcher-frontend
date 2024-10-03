import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to create this file for custom styles
// We'll import other components later

function App() {
  const [topic, setTopic] = useState('');
  const [placeholder, setPlaceholder] = useState('Generative AI impact on Software Development');
  const [progress, setProgress] = useState([]);
  const [report, setReport] = useState('');
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [user, setUser] = useState(null);

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
    // Handle the encrypted JWT token
    console.log("Encoded JWT ID token: " + response.credential);
    // Here you would typically send this token to your backend for verification
    // and then set the user state based on the verified information
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
    // Simulating research process
    setProgress(['Searching for sources...']);
    setIsProgressVisible(true);
    setTimeout(() => setProgress(prev => [...prev, 'Reading content...']), 2000);
    setTimeout(() => setProgress(prev => [...prev, 'Analyzing information...']), 4000);
    setTimeout(() => setProgress(prev => [...prev, 'Generating report...']), 6000);
    setTimeout(() => {
      setReport(`Here's your report on "${topic}".\n\nThis is a placeholder for the actual report content.`);
      setProgress(prev => [...prev, 'Report complete!']);
    }, 8000);
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
    <div className="app-container">
      <header>
        <h1>SonPH AI</h1>
        <nav>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button className="btn btn-ghost" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={handleSignIn}>Sign In with Google</button>
          )}
          <button className="btn btn-outline">Sign-up for Free</button>
        </nav>
      </header>
      <main>
        <h3>Researcher at your fingertips</h3>
        
        <div className="input-container">
          <h4>Write a research paper about:</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={placeholder}
            />
            <button type="submit">Generate Report</button>
          </form>
        </div>

        <button className="credits-btn">Request More Credits</button>

        {progress.length > 0 && (
          <div className="progress-container">
            <button 
              className="collapsible-btn"
              onClick={() => setIsProgressVisible(!isProgressVisible)}
            >
              {isProgressVisible ? 'Hide Progress' : 'Show Progress'}
            </button>
            {isProgressVisible && (
              <div className="progress-content">
                {progress.map((step, index) => (
                  <p key={index}>{step}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {report && (
          <div className="report-container">
            <h4>Generated Report</h4>
            <textarea
              value={report}
              readOnly
              className="report-textarea"
              placeholder="Your report will appear here..."
            />
          </div>
        )}

        <footer>
          <p>Trusted by me, from AI with love :)</p>
        </footer>
      </main>
    </div>
  );
}

export default App;