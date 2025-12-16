# Expo Client (`expo/`)
This package contains the Warike Assistant client built with Expo + Expo Router.

## Prerequisites
- Node.js + pnpm (recommended)
- iOS: Xcode (for Simulator / native builds)
- Android: Android Studio + SDKs (for Emulator / native builds)

## Install
```bash
pnpm install
```

## Environment variables
Create a local env file:
```bash
cp .env.example .env
```

Required / commonly used:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key (used by `ClerkProvider` in `app/_layout.tsx`).
- `EXPO_PUBLIC_API_BASE_URL`: Base URL hosting the backend `/api/chat` endpoint (typically a CloudFront domain or a Lambda Function URL domain).

Optional (only used by the local Expo API routes):
- `GOOGLE_GENERATIVE_AI_API_KEY`: used by `app/api/*` and `constants/Models.ts`.
- `CLERK_SECRET_KEY`: used by `app/api/chat+api.ts` if you use the local Expo API route that verifies Clerk tokens.

## Run (development)
Start the Metro bundler:
```bash
pnpm start
```

Platform-specific:
```bash
pnpm ios
pnpm android
pnpm web
```

## What the app calls in production
The main chat UI (`components/ChatPage.tsx`) builds the chat endpoint using `utils/api.ts`:
- `POST {EXPO_PUBLIC_API_BASE_URL}/api/chat`

It includes Clerk tokens in both:
- `Authorization: Bearer <token>`
- `X-Clerk-Token: <token>`

## Lint
```bash
pnpm lint
```

## Notes
- App routing is file-based under `app/` (Expo Router).
- Chat history is persisted locally via SQLite (`expo-sqlite`).
