import React from 'react';

const FileList = ({ files, onFileSelect }) => {
  const getFileIcon = (file) => {
    if (file.type === 'folder') {
      return '📁';
    } else if (file.path.endsWith('.md')) {
      return '📝';
    } else {
      return '📄';
    }
  };

  const handleFileClick = (file) => {
    if (file.type !== 'folder') {
      onFileSelect(file);
    }
  };

  return (
    <div className="file-list">
      {files.map((file, index) => (
        <div 
          key={index} 
          className={`file-item ${file.type}`}
          onClick={() => handleFileClick(file)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{getFileIcon(file)}</span>
            <span>{file.name}</span>
          </div>
          {file.path && (
            <div className="file-path" style={{ fontSize: '0.8em', marginTop: '5px' }}>
              {file.path}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;