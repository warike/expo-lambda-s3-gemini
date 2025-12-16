.PHONY: help setup-vectors cleanup-vectors ingest infra-init infra-plan infra-apply push-image test-stream

SHELL := /bin/bash

help:
	@echo "Targets:"
	@echo "  setup-vectors   Create/reuse S3 Vectors bucket + index (uses ./setup.sh)"
	@echo "  cleanup-vectors Delete S3 Vectors index + bucket (uses ./cleanup_vector_store.sh)"
	@echo "  ingest          Run data ingestion (uses ./run_data_ingestion.sh)"
	@echo "  infra-init      terraform init in ./infra"
	@echo "  infra-plan      terraform plan in ./infra"
	@echo "  infra-apply     terraform apply in ./infra"
	@echo "  push-image      Build+push Lambda image to ECR and deploy (uses ./push_chat_image.sh)"
	@echo "  test-stream     Test streaming endpoint using terraform outputs (uses ./test_stream.sh)"
	@echo ""
	@echo "Common env vars: AWS_PROFILE AWS_REGION VECTOR_BUCKET_NAME INDEX_NAME CLERK_TOKEN MESSAGE"

setup-vectors:
	./setup.sh

cleanup-vectors:
	./cleanup_vector_store.sh

ingest:
	./run_data_ingestion.sh

infra-init:
	terraform -chdir=infra init

infra-plan:
	terraform -chdir=infra plan

infra-apply:
	terraform -chdir=infra apply

push-image:
	./push_chat_image.sh

test-stream:
	./test_stream.sh
