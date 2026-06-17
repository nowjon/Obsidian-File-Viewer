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

2. Run the container, pointing it at your Fast Note Sync backend:
   ```bash
   docker run -p 8080:80 -e API_UPSTREAM=host.docker.internal:9000 obsidian-file-viewer
   ```

3. The application will be available at `http://localhost:8080`, and a health
   endpoint is exposed at `http://localhost:8080/health`.

### Environment Variables

The application is configured at two stages:

**Build time** (passed with `--build-arg`):

- `REACT_APP_API_BASE_URL` - Base URL the SPA uses for API calls. Defaults to
  empty, which makes the app issue same-origin requests to `/api/*` that nginx
  proxies to the backend. Set this only when the API is served from a different
  origin, e.g. `--build-arg REACT_APP_API_BASE_URL=https://api.example.com`.

**Runtime** (passed with `-e`):

- `API_UPSTREAM` - Host:port of the Fast Note Sync backend that nginx proxies
  `/api/*` requests to (default: `127.0.0.1:9000`). The value is substituted
  into the nginx config at container start.

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

## GitHub Actions Setup

This repository includes a GitHub Actions workflow that automatically builds and pushes Docker images to GitHub Container Registry (GHCR) when changes are pushed to the main branch or when tags are created.

To use this workflow:

1. No additional setup required for GHCR - it's free and integrated with GitHub
2. The published image is available at `ghcr.io/USERNAME/obsidian-file-viewer` (GHCR image names are lowercase)
3. The workflow uses GitHub's built-in `GITHUB_TOKEN` for authentication, so no secrets are needed. The job grants the token `packages: write` permission, which is required to push to GHCR

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.