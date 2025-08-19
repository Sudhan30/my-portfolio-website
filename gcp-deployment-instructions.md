# GCP Deployment Instructions

This document provides the necessary commands to deploy the feedback submission Cloud Function and configure API Gateway.

## Prerequisites

1.  **Google Cloud SDK:** Ensure you have the `gcloud` command-line tool installed and configured.
2.  **Node.js and npm:** Required for deploying the Cloud Function.
3.  **Authentication:** Make sure you are authenticated with GCP: `gcloud auth login`.
4.  **Project Setup:** Set your GCP project: `gcloud config set project YOUR_PROJECT_ID`.

## Deployment Steps

### 1. Deploy the Cloud Function

Navigate to the `functions` directory and run the following command to deploy the function:

```bash
gcloud functions deploy submitFeedback \
  --runtime nodejs18 \
  --trigger-http \
  --entry-point submitFeedback \
  --allow-unauthenticated \
  --region us-central1 # Or your preferred region
```

Once deployed, you will get an HTTPS trigger URL. You will use this URL in the next step.

### 2. (Optional) Set up API Gateway

For a more robust and secure setup, you can put an API Gateway in front of the Cloud Function.

#### a. Create an API Config file

Create a file named `api-gateway-config.yaml` with the following content:

```yaml
swagger: '2.0'
info:
  title: Feedback API
  description: API for submitting feedback
  version: 1.0.0
schemes:
  - https
produces:
  - application/json
paths:
  /submit-feedback:
    post:
      summary: Submit feedback
      operationId: submitFeedback
      x-google-backend:
        address: YOUR_FUNCTION_TRIGGER_URL # Replace with your function's trigger URL
      responses:
        '200':
          description: A successful response
          schema:
            type: string
```

#### b. Create the API Gateway

Run the following commands to create the API gateway:

```bash
# Create the API
gcloud api-gateway apis create feedback-api --project=YOUR_PROJECT_ID

# Create the API config
gcloud api-gateway api-configs create feedback-config \
  --api=feedback-api --swagger-spec=api-gateway-config.yaml \
  --project=YOUR_PROJECT_ID

# Create the gateway
gcloud api-gateway gateways create feedback-gateway \
  --api=feedback-api --api-config=feedback-config \
  --location=us-central1 --project=YOUR_PROJECT_ID
```

After the gateway is created, you will get a URL for the gateway. This is the URL you should use in your frontend application. It will look something like `https://feedback-gateway-xxxxxxxx-uc.a.run.app`.
