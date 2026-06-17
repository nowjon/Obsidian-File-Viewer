/**
 * Filter out hidden files and directories from file lists
 * @param {Array} files - Array of file objects
 * @returns {Array} Filtered array of files
 */
export const filterHiddenFiles = (files) => {
  if (!files || !Array.isArray(files)) {
    return [];
  }

  // Common patterns to exclude
  const hiddenPatterns = [
    '.claude',
    '.obsidian',
    'node_modules',
    '.git',
    '.DS_Store',
    '.hidden',
    '.tmp'
  ];

  return files.filter(file => {
    // Skip if file is null or undefined
    if (!file) return false;
    
    // Skip hidden files/directories (starting with a dot)
    if (file.name && file.name.startsWith('.')) {
      return false;
    }
    
    // Skip files/directories matching hidden patterns
    if (file.path) {
      const normalizedPath = file.path.toLowerCase();
      for (const pattern of hiddenPatterns) {
        if (normalizedPath.includes(`/${pattern}/`) || 
            normalizedPath.endsWith(`/${pattern}`) ||
            normalizedPath === pattern) {
          return false;
        }
      }
    }
    
    // Skip files/directories starting with a dot in their path
    if (file.path && file.path.split('/').some(part => part.startsWith('.'))) {
      return false;
    }
    
    return true;
  });
};

/**
 * Check if a file is a markdown file
 * @param {string} filePath - Path to the file
 * @returns {boolean} True if file is markdown
 */
export const isMarkdownFile = (filePath) => {
  return filePath && filePath.toLowerCase().endsWith('.md');
};

/**
 * Get file extension
 * @param {string} filePath - Path to the file
 * @returns {string} File extension
 */
export const getFileExtension = (filePath) => {
  if (!filePath) return '';
  
  const lastDotIndex = filePath.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  
  return filePath.substring(lastDotIndex);
};