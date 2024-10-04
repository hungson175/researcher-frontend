import { useState, useEffect, useRef } from 'react';

const WEBSOCKET_REPORT_API_URL = process.env.REACT_APP_WEBSOCKET_REPORT_API_URL;

export function useResearchReport() {
  const [topic, setTopic] = useState('');
  const [progress, setProgress] = useState([]);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [websocket, setWebsocket] = useState(null);
  const websocketRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reportLinkEn, setReportLinkEn] = useState('');
  const [reportLinkVi, setReportLinkVi] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportContentEn, setReportContentEn] = useState('');
  const [reportContentVi, setReportContentVi] = useState('');
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
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    websocketRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProgress([]);
    setIsProgressVisible(true);
    setIsGenerating(true);
    setReportLinkEn('');
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

  return {
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
  };
}