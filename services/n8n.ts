import { Language } from "../types";

const N8N_WEBHOOK_URL =
  "https://donlem0n.app.n8n.cloud/webhook/2ff70050-69cc-4a7a-90da-8355aaacb7ba";

interface N8nChat {
  sendMessage: (params: { message: string }) => Promise<{ text: string }>;
}

/**
 * Creates a chat instance that routes messages through the n8n webhook.
 * Each chat gets a unique sessionId so n8n can maintain conversation context.
 */
export const createHeinChat = (language: Language): N8nChat => {
  const sessionId = `hein-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    sendMessage: async ({ message }: { message: string }) => {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook error: ${response.status}`);
      }

      const data = await response.json();

      // n8n Chat Trigger typically returns { output: "..." }
      // but handle other common formats too
      const text =
        typeof data === "string"
          ? data
          : data.output ?? data.response ?? data.text ?? data.message ?? JSON.stringify(data);

      return { text };
    },
  };
};
