# Data Ingestion (`data-ingestion/`)
This package ingests documentation into **AWS S3 Vectors** so the runtime agent can do retrieval-augmented generation (RAG).

## What it does
- Loads local markdown sources from `assets/`
- Chunks them (semantic markdown)
- Generates embeddings
- Upserts vectors + metadata into an S3 Vectors index

## Prerequisites
- Node.js + pnpm
- AWS CLI configured with credentials
- An existing S3 Vectors *bucket* and *index* (or create the index first; see the repo root `setup.sh`)

## Install
```bash
pnpm install
```

## Configure environment
Create a local env file:
```bash
cp .env.example .env
```

Required variables (validated in `src/env.ts`):
- `AWS_PROFILE`
- `AWS_REGION`
- `AWS_S3_VECTORS_BUCKET_NAME`
- `AWS_S3_VECTORS_INDEX_NAME`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `LANGWATCH_API_KEY`

## Run
```bash
pnpm start
```

This runs `src/index.ts`, which:
1. Executes `IngestData()` (chunk + embed + upsert)
2. Executes a small example query against the agent as a smoke test

## Troubleshooting
- If you see permission errors, ensure your AWS profile can call S3 Vectors APIs and that the index name matches what you created.
- If you see embedding/model errors, verify `GOOGLE_GENERATIVE_AI_API_KEY` is set.
