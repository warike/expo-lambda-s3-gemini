# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository overview
This repo is a multi-package system for a RAG chat assistant:
- `expo/`: Expo (React Native) client app.
- `lambda/`: streaming `/api/chat` backend deployed to AWS Lambda as a container image.
- `data-ingestion/`: ingestion job that chunks markdown docs, creates embeddings, and upserts to AWS S3 Vectors.
- `infra/`: Terraform for ECR + Lambda + IAM + (optional) CloudFront.

There is additional Expo-specific guidance in `expo/WARP.md`.

## Common commands
### Root Makefile shortcuts (recommended)
From the repo root:
- List targets: `make help`
- Create/reuse S3 Vectors bucket + index: `make setup-vectors`
- Delete S3 Vectors bucket + index: `make cleanup-vectors`
- Run ingestion: `make ingest`
- Terraform: `make infra-init`, `make infra-plan`, `make infra-apply`
- Build/push Lambda image (updates `infra/lambda-chat.tf`, optionally applies): `make push-image`
- Smoke test streaming endpoint (requires `CLERK_TOKEN`): `make test-stream`

Most Make targets are thin wrappers around the root scripts:
- `setup.sh`, `cleanup_vector_store.sh`, `run_data_ingestion.sh`, `push_chat_image.sh`, `test_stream.sh`.

### Expo client (`expo/`)
Run from the repo root (or `cd expo`):
- Install: `pnpm -C expo install`
- Start dev server: `pnpm -C expo start`
- Run on platforms: `pnpm -C expo ios` / `pnpm -C expo android` / `pnpm -C expo web`
- Lint: `pnpm -C expo lint`

### Lambda backend (`lambda/`)
Run from the repo root (or `cd lambda`):
- Install: `pnpm -C lambda install`
- Build TypeScript to `dist/`: `pnpm -C lambda build`
- Run locally (node, basic sanity checks): `pnpm -C lambda start`
- Tests (watch): `pnpm -C lambda test`
- Tests (CI / single-run): `pnpm -C lambda test:ci`

Run a single test file (recommended to use `test:ci` since `test` forces `--watchAll`):
- `pnpm -C lambda test:ci -- src/__tests__/auth.spec.ts`

Run a single test by name:
- `pnpm -C lambda test:ci -- -t "checkAccess"`

Build the AWS Lambda container image locally:
- `docker build --platform linux/amd64 --provenance=false -t warike-chat-lambda:local lambda`

### Data ingestion (`data-ingestion/`)
Run from the repo root (or `cd data-ingestion`):
- Install: `pnpm -C data-ingestion install`
- Run ingestion: `pnpm -C data-ingestion start` (or `make ingest`)

### Terraform (`infra/`)
- `terraform -chdir=infra init`
- `terraform -chdir=infra plan`
- `terraform -chdir=infra apply`

## Architecture (big picture)
### End-to-end runtime flow (production)
1. The Expo client posts chat messages to `{EXPO_PUBLIC_API_BASE_URL}/api/chat`.
   - Request construction lives in `expo/components/ChatPage.tsx`.
   - The base URL builder is `expo/utils/api.ts` (throws if `EXPO_PUBLIC_API_BASE_URL` is missing).
2. The client attaches Clerk auth headers:
   - `Authorization: Bearer <token>` and `X-Clerk-Token: <token>`.
3. The client also attaches `x-amz-content-sha256` (computed over the JSON body).
   - This is added in `expo/components/ChatPage.tsx` and mirrored by `test_stream.sh`.
4. The Lambda handler (`lambda/src/index.ts`) is a response-streaming entrypoint:
   - Rejects non-`/api/chat` paths with 404.
   - Verifies auth via `lambda/src/auth.ts`.
   - Calls `runAgent(messages, responseStream)` in `lambda/src/mastra/index.ts`.
5. The Mastra agent (`lambda/src/mastra/*`) performs RAG:
   - Vector retrieval is implemented as a tool configured for AWS S3 Vectors.
   - A strict system prompt constrains responses to retrieved context.
6. Lambda streams output back to the client using the `ai` SDK’s UI message stream response.

### Ingestion flow (building the knowledge base)
1. Source documents are currently checked into the repo as markdown strings under `data-ingestion/assets/*`.
2. The ingestion pipeline (`data-ingestion/src/app.ts`) builds `MDocument`s from markdown, chunks them using `semantic-markdown`, embeds the chunks, and upserts them into S3 Vectors.
3. The S3 Vectors index/bucket are created by `setup.sh` (or `make setup-vectors`).
   - The metadata configuration in `setup.sh` is intentionally aligned to the metadata keys inserted by ingestion.

### Infrastructure/deployment flow
- Terraform in `infra/` provisions:
  - ECR repository
  - Image-based Lambda with response streaming enabled + Function URL
  - IAM policies for logs + S3 Vectors (and Bedrock invoke permissions)
  - Optional CloudFront distribution in front of the Function URL
- `push_chat_image.sh`:
  - Reads Terraform outputs to determine account/region/repo.
  - Builds/pushes the `lambda/` image.
  - Updates the image tag reference inside `infra/lambda-chat.tf`.
  - Optionally runs `terraform apply` (can be skipped with `NO_TERRAFORM_APPLY=1`).

## Cross-package conventions and “gotchas”
- **Message format**: the backend expects the `ai` / `@ai-sdk/react` UI message format (`{ messages: UIMessage[] }`).
- **ESM + `.js` import specifiers (Lambda)**: `lambda/` is `"type": "module"` and compiles TS to ESM; runtime imports in TS use `.js` specifiers (e.g. `./auth.js`). Preserve this pattern when adding new modules.
- **Path aliases**:
  - Expo uses `@/…` imports via `expo/tsconfig.json` path mapping.
  - Lambda tests map `@/…` to `lambda/src/…` via `lambda/jest.config.js`.
- **`x-amz-content-sha256` header**: if you add new clients or scripts that call the deployed endpoint, mirror the SHA256 hashing behavior from `expo/components/ChatPage.tsx` / `test_stream.sh` to match the current deployment expectations.
