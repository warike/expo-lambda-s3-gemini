# Pending Work Summary

## Context
- Screen: `components/ChatPage.tsx` + `components/chat/MessageInput.tsx`
- Chat stack uses `useChat` from `@ai-sdk/react` and renders messages via `FlashList`
- API endpoint: `app/api/completion+api.ts` (Google Gemini via `ai` SDK)

---

## ✅ Resolved Issues

### Auto-scroll during streaming
- **Status**: ✅ Fixed
- **Root cause**: `paddingBottom: 150` in `FlashList` meant `distanceFromBottom` was around 150px even when visually at the bottom
- **Solution**: Increased `distanceFromBottom` threshold from 60px to 160px to account for the padding
- Removed verbose debug logs

### Empty message prevention
- **Status**: ✅ Fixed
- `MessageInput` now trims input and ignores empty/whitespace-only messages before calling `onShouldSend`
- `ChatPage` defensively trims `rawText` in `onSendMessage` and returns early when empty

### Keyboard dismiss on scroll
- **Status**: ✅ Fixed
- Added `keyboardDismissMode="on-drag"` to the main `ScrollView`

### User message styling
- **Status**: ✅ Fixed
- User messages now display with a styled bubble (gray background `#f0f0f0`, rounded corners)
- User messages are right-aligned with avatar on the right

### Markdown nested list spacing
- **Status**: ✅ Fixed
- Reduced `marginLeft` from 16 to 8 for ordered and bullet lists
- Reduced `paddingVertical` from 4 to 2 for list items
- Added styled horizontal rule (`hr`) with subtle gray color

### Keyboard hiding messages
- **Status**: ✅ Fixed
- **Root cause**: `KeyboardAvoidingView` was positioned absolutely, causing content not to adjust
- **Solution**: Restructured layout - `KeyboardAvoidingView` now wraps the entire component with proper flex layout
- Input bar is no longer absolute, uses natural flex flow
- Added `keyboardShouldPersistTaps="handled"` for better UX

### Empty assistant messages (ghost bubbles)
- **Status**: ✅ Fixed
- **Root cause**: Messages with only tool invocations or empty parts were being rendered
- **Solution**: `ChatMessage.tsx` now:
  - Detects if message has actual text content
  - Shows loader for assistant messages without content during streaming
  - Filters out empty text parts from rendering
  - Returns `null` for empty user messages

### Tool invocations saved to database
- **Status**: ✅ Fixed
- **Root cause**: All message parts were being saved, including tool invocations
- **Solution**: Added `filterPartsForDB()` helper in `ChatPage.tsx` that:
  - Filters to only keep `type: 'text'` parts
  - Excludes empty or whitespace-only text
  - Skips DB write entirely if no valid parts remain

---

### Chat search functionality
- **Status**: ✅ Fixed
- `CustomDrawer.tsx` now filters chats by title (case-insensitive search)
- Clear button appears when search is active
- Search resets when drawer closes
- Shows "No conversations found" empty state when no results
- Hides drawer items (New Chat, Explore, Settings) during search to focus on results

---

## 🔄 In Progress

### API Authentication (JWT)
- **Status**: 🔄 Client-side ready, server-side pending
- **Done (Client)**:
  - `ChatPage.tsx` now uses `useAuth().getToken()` from Clerk
  - Authorization header is sent with every API request: `Bearer <token>`
  - Transport is memoized for performance
- **Pending (Server)**:
  - Install `@clerk/backend` package
  - Verify JWT in `app/api/completion+api.ts` 
  - Return 401 for unauthorized requests

---

## 📋 Future Work

### Attachments (Images/Documents)
- **Priority**: Medium
- `MessageInput` has UI for camera, image picker, and document picker but the flow is not complete
- Need to:
  - Handle the picked files/images
  - Upload or encode them for the API
  - Display image attachments in messages
  - Consider multimodal support with Gemini

### Model selection
- **Priority**: Low
- MMKV storage key `gptVersion` is set up
- `HeaderDropDown` component exists
- Need to wire up model selection UI and pass selected model to API

### Settings screen enhancements
- **Priority**: Low
- Current settings screen (`app/(auth)/(modal)/settings.tsx`) has basic API key storage and sign-out
- Could add:
  - Theme selection (dark/light)
  - Chat export functionality
  - Clear all chats option

### Testing framework
- **Priority**: Medium
- No test runner is currently configured
- Need to set up Jest or Vitest for unit/integration tests

### Explore screen
- **Priority**: Low
- `app/(auth)/(drawer)/explore.tsx` is a placeholder
- Define what this screen should do (prompts library? templates? history analytics?)

---

## 🐛 Known Issues

1. **Image context menu**: The zeego context menu for images (copy, save, share) may need testing across devices
2. **API key storage**: `keyStorage` MMKV is available but the flow to use custom API keys is not fully wired

---

## 📝 Notes

- All chat messages now use the `UIMessage` format with `parts` array
- Database migration v1→v2 handles the `content`→`parts` schema change
- The app requires `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` environment variables
