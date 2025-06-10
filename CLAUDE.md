# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Concurrent-world is a web client for Concrnt, a distributed microblogging platform. The app is built with React + TypeScript + Vite and uses Material-UI for styling.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Production build (runs prebuild.sh, TypeScript check, and Vite build)
- `pnpm prebuild` - Run prebuild script (./prebuild.sh)
- `pnpm test` - Run Playwright tests on Chromium only
- `pnpm test-all` - Run Playwright tests on all browsers
- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook

## Architecture

### Core Client Library
The app uses `@concurrent-world/client` library for all Concrnt protocol interactions. The client is initialized in `ClientContext.tsx` and provides:
- Authentication (master key or subkey)
- API communication with Concrnt domains
- Real-time subscriptions for notifications
- Timeline and message management

### Context Architecture
The app uses a layered context provider structure in `main.tsx`:
- `ClientProvider` - Manages Concrnt client initialization
- `PreferenceProvider` - User preferences and settings
- `ConcrntThemeProvider` - Theme management
- `GlobalStateProvider` - App-wide state (authentication, timelines, etc.)

Additional contexts in `App.tsx`:
- `SnackbarProvider` (notistack) - Notifications
- `EmojiPickerProvider` - Emoji selection
- `MediaViewerProvider` - Media viewing modals
- `StorageProvider` - File storage handling

### Authentication Flow
- Unauthenticated users see guest pages (`/welcome`, `/register`, guest timeline/profile views)
- Authentication stored in localStorage (`Domain`, `PrivateKey`, `SubKey`, `Identity`)
- `LoginGuard` component redirects unauthenticated users to `/welcome`
- Supports both master keys (full access) and subkeys (limited access)

### Component Structure
- `components/ui/` - Reusable UI components with Storybook stories
- `components/Message/` - Message display and interaction components
- `components/Timeline/` - Timeline rendering components
- `components/Settings/` - Settings and configuration pages
- `pages/` - Top-level page components for routing

### State Management
- Global state via React Context (no external state library)
- User preferences persisted via `usePersistent` hook
- Real-time updates through WebSocket subscriptions to timelines

### Internationalization
Uses react-i18next with locale files in `public/locales/`. Supports Japanese, English, Korean, Thai, and Chinese variants.

### PWA Features
Configured as a Progressive Web App with:
- Service worker for offline functionality
- Manifest for app installation
- Automatic update notifications
- Cache strategies for different resource types

## Testing

Uses Playwright for end-to-end testing with configurations for multiple browsers. Tests run against the development server on port 5173.

## Key Dependencies

- `@concurrent-world/client` - Core Concrnt protocol client
- `@mui/material` + `@emotion` - UI framework and styling
- `react-router-dom` - Client-side routing
- `notistack` - Notification system
- `react-markdown` - Markdown rendering
- `i18next` - Internationalization
- `use-sound` - Audio notifications