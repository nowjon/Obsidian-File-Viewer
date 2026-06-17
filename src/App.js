import React, { useState, useEffect } from 'react';
import FileList from './components/FileList';
import FileViewer from './components/FileViewer';
import { getFileList, getFileContent } from './services/apiService';
import { filterHiddenFiles } from './utils/fileFilter';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  // Load token from environment or localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('obsidianToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('obsidianToken', token);
    }
  }, [token]);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate the token here
    // For now we'll just save it and fetch files
  };

  const loadFiles = async () => {
    if (!token) {
      setError('Please enter your authentication token');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fileList = await getFileList(token);
      const filteredFiles = filterHiddenFiles(fileList);
      setFiles(filteredFiles);
    } catch (err) {
      setError(`Failed to load files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!token) {
      setError('Please enter your authentication token');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const content = await getFileContent(token, file.path);
      setCurrentFile({ ...file, content });
    } catch (err) {
      setError(`Failed to load file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Obsidian File Viewer</h1>
        <p>Browse your Obsidian vault files through the Fast Note Sync API</p>
      </header>

      <form onSubmit={handleTokenSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your API token"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            onClick={loadFiles}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Load Files
          </button>
        </div>
      </form>

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading files...
        </div>
      )}

      {!loading && files.length > 0 && (
        <FileList 
          files={files} 
          onFileSelect={handleFileSelect}
        />
      )}

      {currentFile && (
        <FileViewer file={currentFile} />
      )}
    </div>
  );
}

export default App;