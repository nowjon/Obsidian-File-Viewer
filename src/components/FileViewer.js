import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const FileViewer = ({ file }) => {
  const isMarkdown = file.path && file.path.endsWith('.md');

  return (
    <div className="file-content">
      <h2>{file.name}</h2>
      {file.path && (
        <div className="file-path">{file.path}</div>
      )}
      
      {isMarkdown ? (
        <div className="markdown-content">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {file.content}
          </ReactMarkdown>
        </div>
      ) : (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {file.content}
        </pre>
      )}
    </div>
  );
};

export default FileViewer;