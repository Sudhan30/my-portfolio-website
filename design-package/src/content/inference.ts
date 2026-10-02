export const inferenceStates = [
  {
    id: 'one', label: 'One request', heading: 'From prompt to response',
    explanation: 'First, the model processes the prompt (prefill). Then it generates new tokens step by step (decode). Both stages use inference; the sketch follows a single request through them.',
    tradeoff: 'A single request is easy to follow. It does not show how well hardware is used under load.',
  },
  {
    id: 'queue', label: 'A busy queue', heading: 'Share the work, watch the wait',
    explanation: 'Batching lets a serving system work on several requests together, which can improve hardware utilization. A request may wait to enter a batch. The policy has to balance throughput against time spent waiting.',
    tradeoff: 'Batching is a scheduling choice. It does not guarantee a faster response for every request.',
  },
  {
    id: 'prefix', label: 'A shared prefix', heading: 'Reuse the beginning, compute what comes next',
    explanation: 'When requests share an exact prefix and its cached state is available, the server can reuse that earlier computation. The remaining prompt still needs processing, and each response still needs inference to generate new tokens.',
    tradeoff: 'Reuse depends on a valid cache hit. It saves some prefix work, not the entire response.',
  },
] as const;
export type InferenceState = typeof inferenceStates[number]['id'];
