# GroqChat Desktop

A modern, stylish AI Chat application built with Electron, Vite, React, and Tailwind CSS, powered by the Groq API for lightning-fast inference.

## Features

- **Blazing Fast:** Powered by Groq SDK with streaming responses.
- **Modern UI:** Glassmorphism, dark mode, and smooth transitions.
- **Onboarding:** Securely stores your Groq API key locally.
- **Markdown Support:** Beautiful code highlighting with a "Copy Code" button.
- **Chat History:** Automatically saves your conversations locally.
- **Settings:** Easy model selection and API key management.

## Tech Stack

- **Frontend:** React (TypeScript), Tailwind CSS, Lucide Icons.
- **Markdown:** react-markdown, remark-gfm, react-syntax-highlighter.
- **Desktop:** Electron, Vite, electron-store.
- **AI:** Groq SDK.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository or download the source.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the app in development mode:
```bash
npm run dev
```

### Building for Linux (AppImage)

To package the application into a single `.AppImage` file for Linux:
```bash
npm run build:linux
```
The output will be in the `release/` directory.

## License

MIT
