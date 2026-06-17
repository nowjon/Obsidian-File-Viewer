# Obsidian File Viewer

A web-based file viewer for Obsidian vaults that connects to the Fast Note Sync API, filtering out hidden files like .claude files.

## Features

- Browse files in your Obsidian vault
- Filter out hidden files and directories (starting with ".")
- View markdown files with proper rendering
- Clean, responsive user interface
- Docker containerization support

## Architecture

The application consists of:

1. **Frontend**: React-based web application for browsing files
2. **API Client**: Communicates with Fast Note Sync API
3. **File Filtering**: Excludes hidden files like .claude, .obsidian, node_modules
4. **Markdown Rendering**: Properly displays markdown content

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for containerized deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

1. Start the development server:
   ```bash
   npm start
   ```
   
2. The application will be available at `http://localhost:3000`

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t obsidian-file-viewer .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 obsidian-file-viewer
   ```

3. The application will be available at `http://localhost:8080`

### Environment Variables

The application uses environment variables for configuration:

- `REACT_APP_API_BASE_URL` - Base URL of the Fast Note Sync API (default: http://localhost:8080)

## File Filtering

The application automatically filters out:
- Files and directories starting with "."
- .claude files and directories
- .obsidian directories
- node_modules directories
- Other common hidden files and folders

## API Integration

The application communicates with the Fast Note Sync API using:
- `/api/files` - Get list of all files in vault
- `/api/file` - Get content of a specific file
- `/api/file/info` - Get metadata for a specific file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.