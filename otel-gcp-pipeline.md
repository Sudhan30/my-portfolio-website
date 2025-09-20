# Cost-Effective OpenTelemetry Pipeline on GCP

This guide provides a step-by-step tutorial on how to set up a cost-effective OpenTelemetry pipeline on Google Cloud Platform (GCP) using the free tier of various services.

## Pipeline Architecture

The pipeline consists of the following components:

1.  **OpenTelemetry Collector:** Collects telemetry data from your application.
2.  **Google Cloud Pub/Sub:** A messaging service that acts as a buffer for the telemetry data.
3.  **Google Cloud Function:** A serverless function that is triggered by new messages in the Pub/Sub topic. The function processes the data and sends it to BigQuery for real-time querying and Cloud Storage for long-term storage.
4.  **Google BigQuery:** A data warehouse that allows you to run SQL queries on your telemetry data.
5.  **Google Cloud Storage:** A cost-effective object storage service for long-term data archival.

## Setup Instructions

### 1. Set up GCP Resources

First, you need to create the necessary GCP resources. You can do this using the `gcloud` command-line tool.

**a. Create a Pub/Sub topic:**

```bash
gcloud pubsub topics create otel-data
```

**b. Create a Cloud Storage bucket:**

```bash
gcloud storage buckets create gs://otel-data-archive
```

**c. Create a BigQuery dataset:**

```bash
bq mk --dataset my_project:otel_data
```

**d. Create a BigQuery table:**

You will need to define the schema for your table. The schema will depend on the telemetry data you are collecting. Here is an example schema for traces:

```bash
bq mk --table my_project:otel_data.traces '
{
  "fields": [
    {"name": "trace_id", "type": "STRING"},
    {"name": "span_id", "type": "STRING"},
    {"name": "parent_span_id", "type": "STRING"},
    {"name": "name", "type": "STRING"},
    {"name": "start_time", "type": "TIMESTAMP"},
    {"name": "end_time", "type": "TIMESTAMP"},
    {"name": "attributes", "type": "STRING"}
  ]
}
'
```

### 2. Configure the OpenTelemetry Collector

Next, you need to configure the OpenTelemetry Collector to send data to the Pub/Sub topic you created. You will need to create a `config.yaml` file with the following content:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  googlecloudpubsub:
    project: <your-gcp-project-id>
    topic: projects/<your-gcp-project-id>/topics/otel-data

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [googlecloudpubsub]
```

Replace `<your-gcp-project-id>` with your GCP project ID.

### 3. Create the Cloud Function

Now, you need to create a Cloud Function that will be triggered by new messages in the Pub/Sub topic. The function will process the data and send it to BigQuery and Cloud Storage.

Here is an example of a Cloud Function written in Python:

```python
import base64
import json
from google.cloud import bigquery
from google.cloud import storage

def process_otel_data(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    data = json.loads(pubsub_message)

    # Send to BigQuery
    client = bigquery.Client()
    table_id = "<your-gcp-project-id>.otel_data.traces"
    errors = client.insert_rows_json(table_id, [data])
    if errors == []:
        print("New rows have been added.")
    else:
        print("Encountered errors while inserting rows: {}".format(errors))

    # Send to Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket("otel-data-archive")
    blob = bucket.blob(f"{context.timestamp}.json")
    blob.upload_from_string(pubsub_message)
```

Replace `<your-gcp-project-id>` with your GCP project ID.

You can deploy this function using the `gcloud` command-line tool:

```bash
gcloud functions deploy process_otel_data \
--runtime python39 \
--trigger-topic otel-data \
--entry-point process_otel_data
```

### 4. Start the OpenTelemetry Collector

Finally, you can start the OpenTelemetry Collector with the configuration file you created:

```bash
./otelcol-contrib --config config.yaml
```

Your application can now send OpenTelemetry data to the collector, and it will be processed and stored in BigQuery and Cloud Storage.

## Staying within the Free Tier

*   **Pub/Sub:** The free tier includes 10 GB of messages per month.
*   **Cloud Functions:** The free tier includes 2 million invocations per month.
*   **BigQuery:** The free tier includes 1 TB of queries per month and 10 GB of storage per month.
*   **Cloud Storage:** The free tier includes 5 GB-months of Standard Storage.

To stay within these limits, you can:

*   **Sample your telemetry data:** You can configure your OpenTelemetry SDK to sample a percentage of your data.
*   **Use a more efficient data format:** The example above uses JSON, but you could use a more compact format like Protocol Buffers to reduce the size of your data.
*   **Monitor your usage:** You can monitor your usage of each service in the GCP console.
