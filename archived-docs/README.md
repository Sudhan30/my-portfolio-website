# Archived Documentation

This folder contains documentation files that were removed from the main project as they became redundant or were superseded by newer implementations.

## Files Archived:

### `ENVIRONMENT_SETUP.md`
- **Purpose**: Environment variable setup guide
- **Status**: Superseded by current Firebase Hosting setup
- **Replacement**: Information consolidated in main README.md and ARCHITECTURE.md

### `deploy-to-gcs.sh`
- **Purpose**: Google Cloud Storage deployment script
- **Status**: No longer needed
- **Replacement**: Using Firebase Hosting instead of GCS

### `GCS_DEPLOYMENT.md`
- **Purpose**: GCS deployment documentation
- **Status**: Superseded by Firebase Hosting
- **Replacement**: Firebase Hosting is now the primary deployment method

### `GITHUB_ACTIONS_DEPLOYMENT.md`
- **Purpose**: GitHub Actions deployment guide
- **Status**: Redundant with current workflow
- **Replacement**: Current workflow in `.github/workflows/firebase-hosting-merge.yml`

### `gcp-deployment-instructions.md`
- **Purpose**: GCP deployment instructions
- **Status**: Superseded by current setup
- **Replacement**: Information consolidated in ARCHITECTURE.md and setup scripts

## Current Documentation Structure:

- `README.md` - Main project overview
- `ARCHITECTURE.md` - System architecture
- `OPENTELEMETRY_IMPLEMENTATION.md` - OpenTelemetry setup
- `EMAIL_SETUP.md` - Email configuration
- `TELEMETRY_SYSTEM.md` - Custom telemetry
- `HERO_IMAGE_SETUP.md` - Image optimization

## Setup Scripts:

- `setup-otel-gcp.sh` - OpenTelemetry GCP resources
- `deploy-otel-pipeline.sh` - OpenTelemetry deployment
- `setup-secrets.sh` - Secret Manager setup