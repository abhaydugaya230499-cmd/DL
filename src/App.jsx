import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, 
  Upload, 
  MessageCircle, 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ShieldCheck,
  Zap,
  Activity,
  History
} from 'lucide-react';

const DISEASES = [
  {
    name: 'Healthy Foliage',
    status: 'success',
    confidence: '99.2%',
    severity: 'Low',
    risk: 'Minimum',
    treatment: 'No treatment needed. Your plant is thriving! Continue your current watering and nutrient schedule.',
    prevention: 'Regularly dust leaves to ensure maximum photosynthesis efficiency.'
  },
  {
    name: 'Early Blight',
    status: 'danger',
    confidence: '94.5%',
    severity: 'Moderate',
    risk: 'High',
    treatment: 'Apply a copper-based fungicide. Prune lower leaves to improve air circulation and reduce soil splash.',
    prevention: 'Rotate crops annually and avoid overhead irrigation.'
  },
  {
    name: 'Powdery Mildew',
    status: 'danger',
    confidence: '92.1%',
    severity: 'Low to Moderate',
    risk: 'Medium',
    treatment: 'Spray with a mixture of potassium bicarbonate or neem oil. Remove heavily infected foliage.',
    prevention: 'Space plants adequately to ensure good air flow and reduce humidity.'
  },
  {
    name: 'Iron Chlorosis',
    status: 'warning',
    confidence: '81.4%',
    severity: 'Nutritional',
    risk: 'Systemic',
    treatment: 'Apply chelated iron to the soil or as a foliar spray. Check soil pH to ensure it is not too alkaline.',
    prevention: 'Improve soil drainage and avoid over-fertilizing with phosphorus.'
  },
  {
    name: 'Spider Mite Damage',
    status: 'danger',
    confidence: '88.7%',
    severity: 'High',
    risk: 'Extreme',
    treatment: 'Blast with a strong stream of water or apply insecticidal soap. Increase humidity around the plant.',
    prevention: 'Quarantine new plants and keep foliage clean and hydrated.'
  }
];

const App = () => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Flora Intelligence Assistant. Upload a leaf photo for an instant health check!", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processFile = (uploadedFile) => {
    setFile(URL.createObjectURL(uploadedFile));
    setScanning(true);
    setResult(null);

    // Simulate AI scanning
    setTimeout(() => {
      const randomResult = DISEASES[Math.floor(Math.random() * DISEASES.length)];
      setResult(randomResult);
      setScanning(false);
      setHistory(prev => [randomResult, ...prev].slice(0, 5));
    }, 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      let botResponse = "I recommend checking the soil moisture and ensuring proper sunlight for most indoor plants.";
      const lowerInput = inputText.toLowerCase();
      
      if (lowerInput.includes('water')) {
        botResponse = "Overwatering is the #1 killer of houseplants! Only water when the top inch of soil feels dry.";
      } else if (lowerInput.includes('light')) {
        botResponse = "Most plants thrive in bright, indirect light. Direct noon sun can often scorch the leaves.";
      } else if (lowerInput.includes('pest') || lowerInput.includes('bug')) {
        botResponse = "If you see small spots or webs, use neem oil or insecticidal soap immediately to prevent spread.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="app-container">
      <header className="glass">
        <div className="logo">
          <Leaf size={28} className="logo-icon" />
          <span>FloraGuard <span style={{color: 'var(--primary)'}}>Pro</span></span>
        </div>
        <nav style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div className="nav-stats glass" style={{padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', gap: '1rem'}}>
            <span><Activity size={12} style={{verticalAlign: 'middle', marginRight: 4}} /> Engine: v2.4</span>
            <span><Zap size={12} style={{verticalAlign: 'middle', marginRight: 4}} /> Latency: 24ms</span>
          </div>
          <button className="btn btn-ghost" onClick={() => setIsChatOpen(true)}>AI Support</button>
        </nav>
      </header>

      <main>
        <section className="hero animate-fade-in">
          <h1>Diagnose Plant <br /><span className="gradient-text">Diseases Instantly</span></h1>
          <p>Our deep learning models identify over 30+ plant pathogens from a single leaf photo. Get professional-grade treatment advice in real-time.</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button className="btn" onClick={() => document.getElementById('file-upload').click()}>Scan New Leaf</button>
            <button className="btn btn-ghost" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <History size={18} /> View History
            </button>
          </div>
        </section>

        <div className="detection-grid animate-fade-in">
          <div 
            className={`upload-zone glass ${scanning ? 'scanning' : ''}`}
            onClick={() => !scanning && document.getElementById('file-upload').click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('dragging'); }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('dragging');
              if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
            }}
          >
            <input 
              type="file" 
              id="file-upload" 
              hidden 
              onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} 
              accept="image/*"
            />
            {file ? (
              <div className="preview-container">
                <img src={file} alt="Preview" className="leaf-preview" />
                {scanning && (
                  <div className="scanning-overlay">
                    <div className="scan-line"></div>
                    <div className="scan-points">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="scan-point" style={{
                          top: `${Math.random() * 80 + 10}%`,
                          left: `${Math.random() * 80 + 10}%`,
                          animationDelay: `${i * 0.3}s`
                        }}></div>
                      ))}
                    </div>
                    <div className="scan-content">
                      <ShieldCheck size={64} className="pulse-icon" />
                      <h3>Analyzing Patterns...</h3>
                      <p>Deep scan in progress</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-prompt">
                <div className="icon-stack">
                  <Upload className="upload-icon" size={48} />
                  <Leaf className="leaf-mini" size={24} />
                </div>
                <h3>Identify Disease</h3>
                <p>Drag leaf photo here or click to browse</p>
                <div className="upload-specs">
                  <span>Supports: JPG, PNG, WEBP</span>
                  <span>Min resolution: 512px</span>
                </div>
              </div>
            )}
          </div>

          <div className="result-container">
            {result ? (
              <div className="result-card glass animate-fade-in highlight-border">
                <div className="result-header">
                  <div>
                    <span className={`status-badge status-${result.status}`}>
                      {result.status === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                      {result.status === 'success' ? 'Health Confirmed' : 'Pathogen Detected'}
                    </span>
                    <h2 className="disease-title">{result.name}</h2>
                  </div>
                  <div className="confidence-score">
                    <span className="label">Confidence</span>
                    <span className="value">{result.confidence}</span>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Severity</span>
                    <span className="metric-value">{result.severity}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Spread Risk</span>
                    <span className="metric-value">{result.risk}</span>
                  </div>
                </div>
                
                <div className="treatment-section">
                  <h4><Info size={18} /> Treatment Protocol</h4>
                  <p>{result.treatment}</p>
                </div>

                <div className="prevention-card">
                  <h5>Agronomist Recommendation</h5>
                  <p>{result.prevention}</p>
                </div>
                
                <button className="btn btn-secondary" style={{width: '100%', marginTop: '1.5rem'}} onClick={() => {setFile(null); setResult(null);}}>
                  Start New Diagnosis
                </button>
              </div>
            ) : (
              <div className="glass empty-state">
                <div className="empty-content">
                  <Activity size={48} className="empty-icon" />
                  <h3>Waiting for Data</h3>
                  <p>The neural engine will display diagnostic results here after you upload a sample image.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chatbot */}
      <div className={`chatbot-trigger ${isChatOpen ? 'active' : ''}`} onClick={() => setIsChatOpen(!isChatOpen)}>
        {isChatOpen ? <X /> : <MessageCircle />}
      </div>

      {isChatOpen && (
        <div className="chat-window glass animate-fade-in">
          <div className="chat-header">
            <div className="avatar">
              <Leaf size={20} />
            </div>
            <div className="bot-info">
              <div className="name">Flora Assistant</div>
              <div className="status">AI Engine Online</div>
            </div>
            <button className="close-chat" onClick={() => setIsChatOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Ask about plant care..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="send-btn"><Send size={18} /></button>
          </form>
        </div>
      )}

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <Leaf size={20} /> FloraGuard AI
          </div>
          <p>© 2024 Advanced Agricultural Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
