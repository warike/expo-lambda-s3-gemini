# Chat Lambda (`lambda/`)
This package is the production chat backend deployed to AWS Lambda as a **container image**.

It exposes a streaming `POST /api/chat` endpoint and runs a Mastra agent with a vector-query tool backed by **AWS S3 Vectors**.

## Key entrypoints
- `src/index.ts`: Lambda handler (response streaming) and routing for `/api/chat`.
- `src/auth.ts`: Clerk JWT verification.
- `src/mastra/*`: Mastra agent + tools + models + observability.

## Prerequisites
- Node.js + pnpm
- (For deployment) Docker + AWS CLI + Terraform stack under `../infra/`

## Install
```bash
pnpm install
```

## Environment variables
Runtime env vars are validated in `src/env.ts`.

Create a local env file if you want to run locally:
```bash
cp .env .env.local 2>/dev/null || true
# or create `./.env` manually
```

Required / commonly used:
- `AWS_REGION`
- `AWS_S3_VECTORS_BUCKET_NAME`
- `AWS_S3_VECTORS_INDEX_NAME`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GOOGLE_LANGUAGE_MODEL` (default `gemini-2.5-flash`)
- `GOOGLE_EMBEDDING_MODEL` (default `text-embedding-004`)
- `CLERK_SECRET_KEY`
- `LANGWATCH_API_KEY`

## Build
```bash
pnpm build
```

This compiles TypeScript to `dist/`.

## Run locally (node)
```bash
pnpm start
```

Notes:
- This runs `node dist/index.js` which is useful for basic sanity checks, but it is not the same as invoking the AWS Lambda runtime.
- The deployed runtime uses the Lambda container entrypoint (`CMD ["index.handler"]` in `Dockerfile`).

## Run tests
```bash
pnpm test
```

## Docker image (for AWS Lambda)
Build the Lambda image (Linux/amd64 is important when building on Apple Silicon):
```bash
docker build --platform linux/amd64 --provenance=false -t warike-chat-lambda:local .
```

Deployment uses ECR and Terraform (see `../infra/README.md`).
