import { ConnectionStatus } from '../types';

const N8N_WEBHOOK_URL =
  'https://donlem0n.app.n8n.cloud/webhook/2ff70050-69cc-4a7a-90da-8355aaacb7ba';

export const checkWorkflowConnectivity = async (): Promise<ConnectionStatus> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    // n8n webhooks may return 200 on GET or 405 (Method Not Allowed)
    // Either means the endpoint is reachable and the workflow is active
    return response.ok || response.status === 405 ? 'connected' : 'disconnected';
  } catch (error) {
    console.warn('Connectivity check failed:', error);
    return 'disconnected';
  }
};
