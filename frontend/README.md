# Dérive Frontend

This repository contains the frontend application for the Dérive music metadata management platform. It's built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Routing**: React Router
- **Build Tool**: Vite
- **Package Manager & Runtime**: Bun
- **Table/Data Display**: TanStack Table
- **Forms**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **AI Integration**: Assistant UI

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images and other assets
│   ├── components/       # UI components
│   │   ├── ui/           # Core UI components
│   │   ├── forms/        # Form components
│   │   └── layout/       # Layout components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── store/            # Zustand stores
│   └── utils/            # Utility functions
├── App.tsx               # Main component
└── main.tsx              # Entry point
```

## Prerequisites

- Node.js 18+
- Bun 1.0+

## Setup & Installation

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
bun install
```

## Development

```bash
# Start the development server
bun run dev
```

This will start the Vite development server at `http://localhost:5173`.

## Building for Production

```bash
# Build the frontend
bun run build
```

The build output will be in the `dist` directory.

## UI Components

Our application uses custom Tailwind CSS components built with the Dérive design system. The primary UI components include:

- **Button**: Multi-variant buttons (primary, secondary, outline, ghost)
- **Card**: Container component with header, content, and footer sections
- **Input**: Form input components with validation states
- **Table**: Data table component for displaying submission data
- **Badge**: Status indicators

## Color Palette

The Dérive brand color palette consists of:

- **Bright Red**: #DE354C (Primary action color)
- **Deep Red**: #932432 (Hover/active state for primary actions)
- **Pure Purple**: #3C1874 (Secondary color, headings)
- **Purple Tinged Grey**: #283747 (Text, borders)
- **Cloud**: #F3F3F3 (Background, secondary buttons)

## Features

- **Dashboard**: Admin view of all metadata submissions
- **Submission Form**: Form for submitting new metadata
- **Detail View**: Detailed view of each submission
- **AI Processing**: Integration with our AI agent for metadata normalization
- **Story Protocol**: Integration with Story Protocol for registering IP assets

## License

Proprietary - All Rights Reserved
