# Warike Assistant - Features Documentation

> **Version**: 1.0.0  
> **Last Updated**: December 6, 2025

---

## 🏠 Overview

Warike Assistant is an AI-powered chat application built with Expo and React Native. It provides a native mobile experience for conversing with Google's Gemini AI model, with local persistence of chat history.

---

## 🔐 Authentication

### Clerk Integration
- **Sign Up / Sign In**: Email and password-based authentication using Clerk
- **Session Management**: Automatic session persistence and refresh
- **User Profile**: Access to user data (name, avatar) via Clerk hooks
- **Protected Routes**: Automatic redirect to login for unauthenticated users

### Auth Flow
1. Landing page with animated intro (`AnimatedIntro.tsx`)
2. "Get Started" button leads to login/register modal
3. Successful auth redirects to main chat drawer

---

## 💬 Chat Features

### AI Conversation
| Feature | Description |
|---------|-------------|
| **Streaming Responses** | Real-time token-by-token response display using `ai` SDK |
| **Gemini 2.5 Flash** | Powered by Google's latest language model |
| **Message History** | All conversations persisted locally in SQLite |
| **Multiple Chats** | Create and manage multiple conversation threads |

### Message Input
| Feature | Description |
|---------|-------------|
| **Text Input** | Multiline text input with auto-focus |
| **Send/Stop Controls** | Send button when idle, stop button during streaming |
| **Empty Prevention** | Trims whitespace and blocks empty submissions |
| **Attachment Actions** | Expandable menu with camera, gallery, and document picker icons (UI ready) |
| **Animated Controls** | Smooth expand/collapse animations using Reanimated |

### Message Display
| Feature | Description |
|---------|-------------|
| **User/Assistant Distinction** | Different styling and avatars for each role |
| **User Message Bubbles** | Right-aligned with gray background and rounded corners |
| **Assistant Messages** | Left-aligned with app logo avatar |
| **Markdown Rendering** | Full markdown support including code blocks, lists, links |
| **Loading Animation** | Lottie animation while waiting for response |

### Chat UX
| Feature | Description |
|---------|-------------|
| **Auto-scroll** | Automatically follows streaming responses |
| **Scroll Detection** | Respects user scroll-up intent (160px threshold) |
| **Keyboard Avoiding** | Proper keyboard handling - content adjusts when keyboard appears |
| **Keyboard Dismiss** | Keyboard hides on scroll (`on-drag` mode) |
| **Quick Suggestions** | Horizontal scrollable prompt suggestions for new chats |
| **Smart Loading** | Shows loader for assistant messages during streaming, not empty bubbles |
| **Empty Message Filtering** | Tool invocations and empty parts are filtered from display |

---

## 📑 Markdown Support

### Supported Elements
- **Headings**: h1-h6 with proper sizing and spacing
- **Bold/Italic**: Standard markdown emphasis
- **Code Blocks**: Styled with monospace font and gray background
- **Inline Code**: Rounded background styling
- **Lists**: Ordered and unordered with mobile-optimized nesting
- **Links**: Styled with blue color and underline
- **Horizontal Rules**: Subtle gray separator line

### Mobile Optimizations
- Reduced margin on nested lists (8px instead of 16px)
- Compact vertical padding on list items
- Responsive font sizing for different heading levels

---

## 📂 Chat Management

### Drawer Navigation
- **Chat History**: All previous chats listed in drawer
- **Search Conversations**: Filter chats by title in real-time (case-insensitive)
- **Clear Search**: X button to quickly clear search
- **Empty State**: Shows "No conversations found" when search has no results
- **New Chat**: Quick action button in header

### Chat Actions
| Action | How |
|--------|-----|
| **Open Chat** | Tap on chat in drawer |
| **Rename Chat** | Long-press → Context menu → "Rename" |
| **Delete Chat** | Long-press → Context menu → "Delete" with confirmation |
| **New Chat** | Tap "+" icon in header |

### Data Persistence
- **SQLite Database**: `chat.db` stores all chats and messages
- **Schema Versioning**: Automatic migrations via `PRAGMA user_version`
- **CASCADE Delete**: Deleting a chat removes all its messages
- **Smart Filtering**: Only text content is saved; tool invocations and empty parts are excluded

---

## ⚙️ Settings

### Available Options
| Setting | Location |
|---------|----------|
| **Sign Out** | Settings modal |
| **API Key** | Settings modal (for custom keys) |
| **Organization** | Settings modal (optional) |

### Storage
- **MMKV**: Fast key-value storage for preferences
- **Secure Store**: Available for sensitive data via Expo Secure Store

---

## 🎨 UI/UX

### Theming
- **Light/Dark Support**: Theme hooks available (`use-color-scheme.ts`)
- **Color Tokens**: Centralized in `constants/Colors.ts`
- **Shared Styles**: Common layouts in `constants/Styles.ts`

### Animation
- **Reanimated**: Smooth animations throughout the app
- **Lottie**: Loading animations for chat responses
- **Blur Views**: Frosted glass effects on input bar

### Navigation
- **Expo Router**: File-based routing
- **Drawer Navigator**: Main navigation with chat history
- **Stack Navigator**: For modals and deep navigation
- **Safe Areas**: Proper handling of notches and home indicators

---

## 🔌 API Integration

### Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/completion` | POST | Main chat endpoint with streaming |
| `/api/chat` | POST | Simple completion endpoint |

### Configuration
```bash
# Required environment variables
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional
EXPO_PUBLIC_API_BASE_URL=https://your-production-url.com
```

---

## 📱 Platform Support

| Platform | Status |
|----------|--------|
| **iOS** | ✅ Full support |
| **Android** | ✅ Full support |
| **Web** | ⚠️ Partial (Expo web) |

### Native Features Used
- SQLite (expo-sqlite)
- Secure Store (expo-secure-store)
- Image Picker (expo-image-picker)
- Document Picker (expo-document-picker)
- Media Library (expo-media-library)
- Camera (expo-camera)
- Haptics (expo-haptics)

---

## 📊 Tech Stack Summary

| Category | Technology |
|----------|------------|
| **Framework** | Expo SDK 53 |
| **Routing** | Expo Router v4 |
| **Language** | TypeScript |
| **AI SDK** | Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| **LLM Provider** | Google Generative AI (Gemini) |
| **Auth** | Clerk |
| **Database** | SQLite (expo-sqlite) |
| **State** | MMKV, React hooks |
| **Animation** | React Native Reanimated 3 |
| **Navigation** | React Navigation (drawer, stack) |
| **UI Components** | Custom + Zeego (context menus) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

---

## 📁 Project Structure

```
warikeapp/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authenticated routes
│   │   ├── (drawer)/      # Drawer navigation
│   │   │   └── (chat)/    # Chat screens
│   │   └── (modal)/       # Modal screens
│   ├── api/               # API routes
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Landing page
│   └── login.tsx          # Auth screen
├── components/            # Reusable components
│   ├── chat/             # Chat-specific components
│   └── ui/               # Generic UI components
├── constants/            # Colors, styles, models
├── hooks/                # Custom React hooks
├── utils/                # Database, API, storage utilities
└── docs/                 # Documentation
```
