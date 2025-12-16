# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands and workflows

### Install dependencies

The README assumes `npm`:

```bash
npm install
```

A `pnpm-lock.yaml` is present, so you can also use `pnpm` if preferred:

```bash
pnpm install
```

### Start the app (development)

Expo dev server with interactive QR / simulator options:

```bash
npm start
# or
npx expo start
```

Platform-specific runs:

```bash
npm run android   # expo run:android
npm run ios       # expo run:ios
npm run web       # expo start --web
```

### Linting

ESLint is configured via `eslint.config.js` (extends `eslint-config-expo`). Run:

```bash
npm run lint
```

### Tests

There is currently **no** `test` script or test runner configured in `package.json`. There is no standard command to run a single test yet; adding tests will require setting up a test framework (e.g., Jest) first.

### Resetting to a blank Expo app

The starter script `scripts/reset-project.js` can move or delete the current app and related directories and generate a fresh Expo Router skeleton under `app/`:

```bash
npm run reset-project
```

This is destructive for the current `app/`, `components/`, `hooks/`, `constants/`, and `scripts/` directories (they are either moved into `app-example/` or removed), so **do not** run this in an already-customized project unless you explicitly want to reset it.

## Environment & configuration

Key environment variables used in the app:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: required by `ClerkProvider` in `app/_layout.tsx` for authentication.
- `GOOGLE_GENERATIVE_AI_API_KEY`: used in `constants/Models.ts` and `app/api/completion+api.ts` to configure the Google Generative AI client.
- `EXPO_PUBLIC_API_BASE_URL`: optional base URL used by `utils/api.ts` in production and some dev cases to build API endpoints. If not set, dev mode falls back to the Expo dev server origin or `http://localhost:8081`.

Other important config:

- `app.config.ts` defines the Expo app config, plugins (router, secure store, SQLite, fonts, media library, splash screen), runtime version, EAS project ID, and native bundle identifiers.
- `tsconfig.json` extends `expo/tsconfig.base` and defines the path alias `@/*` -> project root, which is heavily used throughout the codebase.
- `eslint.config.js` uses Expos recommended ESLint flat config and ignores `dist/*`.

## High-level architecture

### Routing & layout

- The app uses **Expo Router** with file-based routing under `app/`.
- Root layout `app/_layout.tsx`:
  - Loads custom fonts via `expo-font` and controls the splash screen via `expo-splash-screen`.
  - Wraps the app in `ThemeProvider` from `@react-navigation/native` using a simple `useColorScheme` hook (`hooks/use-color-scheme.ts`).
  - Integrates **Clerk** auth via `ClerkProvider` plus an `InitialLayout` component that:
    - Waits for both fonts and Clerk `useAuth` to be loaded before hiding the splash screen.
    - Uses `useSegments` to detect if the user is inside the `(auth)` route group.
    - Redirects signed-in users into `/(auth)` and unsigned users to `index`.
  - Registers a navigation stack with routes:
    - `index` (landing screen, no header)
    - `login` (modal auth screen)
    - `(auth)` (authenticated area, no header)

### Authentication flow

- Landing screen: `app/index.tsx`
  - Renders `AnimatedIntro` plus `BottomLoginSheet` CTA.
  - If Clerk `useAuth` reports the user as signed in, it redirects to `/(auth)`.
- Login/register screen: `app/login.tsx`
  - Uses `useLocalSearchParams` to read a `type` param (`login` vs `register`).
  - Uses Clerk hooks `useSignIn` and `useSignUp` to handle email/password sign-in and sign-up, including session activation.
  - Displays loading overlay while requests are in flight.

### Authenticated shell & navigation

- `app/(auth)/_layout.tsx`:
  - Wraps the authenticated area in `SQLiteProvider` from `expo-sqlite` with `onInit={migrateDbIfNeeded}` to ensure the chat database schema is present.
  - Hosts a `Stack` with:
    - `(drawer)` (the main drawer-based shell)
    - `(modal)/settings` (modal settings/preferences screen)
- `app/(auth)/(drawer)/_layout.tsx`:
  - Defines the **drawer navigator** (`expo-router/drawer`) with custom content from `components/CustomDrawer`.
  - Main drawer items:
    - `(chat)/new`: primary chat experience (“Warike Assistant”).
    - `explore`: placeholder Explore screen.
    - `settings`: simple in-drawer settings screen.
    - `(chat)/[id]`: same chat page, but for an existing chat ID; hidden from the drawer list.
  - Configures drawer styles, header icons, and a header action that deep-links to a new chat.

### Chat & AI integration

#### UI side

- `components/ChatPage.tsx` drives the main assistant experience and is routed to by:
  - `app/(auth)/(drawer)/(chat)/new.tsx`
  - `app/(auth)/(drawer)/(chat)/[id].tsx`
- `ChatPage` responsibilities:
  - Uses `useChat` from `@ai-sdk/react` with a `DefaultChatTransport` pointing to the Expo Route `app/api/completion+api.ts` (`/api/completion`).
  - Uses `expo/fetch` as the `fetch` implementation for React Native.
  - Stores chats in SQLite using `addChat` and `addMessage` from `utils/Database.ts` once the first user message is sent.
  - Uses `MMKV` (`utils/Storage.ts`, `storage` instance) to persist the selected model under the key `gptVersion`.
  - Renders:
    - `ChatMessage` for individual messages (`ai` library `UIMessage` type).
    - `MessageSuggestions` to seed a new conversation.
    - `MessageInput` providing rich input (attachments, animated controls, stop/submit buttons).

- `components/chat/ChatMessage.tsx`:
  - Renders assistant vs user messages with different avatars (project logo vs Clerk user image).
  - User messages display with a styled bubble (gray background, rounded corners) and right-aligned layout.
  - Supports `UIMessage.parts` array format for rendering different content types.
  - Includes loading state with Lottie animation.

- `components/chat/ChatMarkdown.tsx`:
  - Custom Markdown renderer using `react-native-markdown-display`.
  - Optimized styling for mobile screens with reduced padding on nested lists.
  - Styled horizontal rules, code blocks, and inline code.
  - Responsive typography for headings (h1-h6).

- `components/chat/MessageInput.tsx`:
  - Handles text entry, expansion of extra actions (camera, gallery, document picker), and send/stop controls.
  - Communicates with `useChat` via `onShouldSend` and `onShouldStop` callbacks and the `status` prop (`ChatStatus`).
  - Trims input and prevents empty message submission.
  - Animated expand/collapse for attachment actions using `react-native-reanimated`.

- `components/chat/MessageSuggestions.tsx`:
  - Renders a horizontally scrollable list of predefined prompts and passes the composed text back to `ChatPage`.

- `components/chat/MessageLoader.tsx`:
  - Lottie-based loading animation for streaming responses.

- `components/CompletionPage.tsx`:
  - A simpler, standalone chat view wired to the same `/api/completion` endpoint, primarily useful as a reference for using `ai` in a basic UI.

#### Chat UX Enhancements

- **Streaming auto-scroll**: Messages auto-scroll during streaming, with threshold-based detection (160px) to respect user scroll-up intent.
- **Keyboard dismiss on scroll**: `keyboardDismissMode="on-drag"` is enabled on the main `ScrollView` to hide the keyboard when scrolling.
- **Empty message prevention**: Both `MessageInput` and `ChatPage` trim and validate input to prevent sending empty prompts.

#### API routes & model configuration

- `app/api/completion+api.ts`:
  - Implements a `POST` handler accepting `{ messages: UIMessage[] }`.
  - Uses `createGoogleGenerativeAI` configured with `GOOGLE_GENERATIVE_AI_API_KEY` and calls `streamText` with `client.languageModel('gemini-2.5-flash')`.
  - Relays the streaming response back using `toUIMessageStreamResponse` with appropriate headers for the `@ai-sdk/react` UI layer.

- `app/api/chat+api.ts`:
  - Implements a simple `prompt`-based `POST` handler using `streamText` and the shared `google` client from `constants/Models.ts` (`LanguageModel.GEMINI_2_5_FLASH`).
  - Returns a text stream response via `toTextStreamResponse`.

- `constants/Models.ts` exposes the shared `google` client and the `LanguageModel` enum. This is the central place to adjust the default model ID.

- `utils/polyfills.js` installs polyfills (`structuredClone`, `TextEncoderStream`, `TextDecoderStream`) on native platforms so the `ai` streaming stack works consistently outside the web environment.

- `utils/api.ts` builds the correct base URL for calling Expo API routes from the app, using Expo dev server metadata in development and `EXPO_PUBLIC_API_BASE_URL` in production.

### Persistence: SQLite & MMKV

- `utils/Database.ts`:
  - Defines `DATABASE_NAME = 'chat.db'` and `migrateDbIfNeeded`, which uses `PRAGMA user_version` for schema versioning.
  - Initial migration creates:
    - `chats (id INTEGER PRIMARY KEY, title TEXT NOT NULL)`
    - `messages (id, chat_id, content, imageUrl, role, prompt, FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE)`
  - Exposes helpers: `addChat`, `getChats`, `getMessages`, `addMessage`, `deleteChat`, `renameChat`.

- `components/CustomDrawer.tsx` uses these helpers to:
  - Load chat history when the drawer opens and show each chat as a drawer item.
  - Navigate to an existing chat (`/(auth)/(drawer)/(chat)/[id]`).
  - Allow renaming and deleting chats via context-menu actions and alerts.

- `utils/Storage.ts` defines three MMKV stores:
  - `storage` (`id: 'gptversion'`) for model selection and other chat UI prefs.
  - `keyStorage` (`id: 'openaikey'`) for storing the user’s API key and organization.
  - `chatStorage` (`id: 'chats'`), available for additional local chat state if needed.

- `app/(auth)/(modal)/settings.tsx` is the main entry point for editing MMKV-based configuration:
  - Reads and writes `apikey` and `org` values via `useMMKVString` and `keyStorage`.
  - Provides actions to save or remove the API key/organization.
  - Includes a Clerk `signOut` button.

### Theming, layout & shared UI

- `constants/Colors.ts` and `constants/Styles.ts` define shared color tokens and layout helpers (e.g., `defaultStyles.btn`, `pageContainer`, loading overlay).
- `constants/theme.ts` plus hooks in `hooks/use-theme-color.ts` and `hooks/use-color-scheme.ts` provide a light/dark theme abstraction used by some components.
- `components/AnimatedIntro.tsx` and `constants/index.ts` implement the animated marketing banner on the landing page.
- `components/ProfileDrawer.tsx` renders the user’s Clerk profile summary and links to the modal settings screen at the bottom of the drawer.

These modules together form the core architecture: Expo Router + Clerk for auth, an AI-powered chat experience backed by Google Gemini via `ai` and streaming API routes, and persistent chat history stored locally in SQLite and MMKV.