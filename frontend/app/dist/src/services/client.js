import { A2AClient } from "@a2a-js/sdk/client";
const A2UI_MIME_TYPE = "application/json+a2ui";
export class A2UIClientService {
    #serverUrl;
    #client = null;
    constructor(serverUrl = "http://localhost:8000") {
        this.#serverUrl = serverUrl;
    }
    async #getClient() {
        if (!this.#client) {
            this.#client = await A2AClient.fromCardUrl(`${this.#serverUrl}/.well-known/agent-card.json`, {
                fetchImpl: async (url, init) => {
                    const headers = new Headers(init?.headers);
                    headers.set("X-A2A-Extensions", "https://a2ui.org/a2a-extension/a2ui/v0.8");
                    return fetch(url, { ...init, headers });
                }
            });
        }
        return this.#client;
    }
    async send(message) {
        const client = await this.#getClient();
        let parts = [];
        if (typeof message === 'string') {
            parts = [{ kind: "text", text: message }];
        }
        else {
            parts = [{
                    kind: "data",
                    data: message,
                    mimeType: A2UI_MIME_TYPE,
                }];
        }
        const response = await client.sendMessage({
            message: {
                messageId: crypto.randomUUID(),
                role: "user",
                parts: parts,
                kind: "message",
            },
        });
        if ("error" in response) {
            throw new Error(response.error.message);
        }
        const result = response.result;
        if (result.kind === "task" && result.status.message?.parts) {
            const messages = [];
            for (const part of result.status.message.parts) {
                if (part.kind === 'data') {
                    // It's an A2UI message
                    messages.push(part.data);
                }
                else if (part.kind === 'text') {
                    // We might want to handle text differently, but for now let's wrap it in a pseudo-message 
                    // or returning it alongside.
                    // NOTE: The current A2UI processor expects specific message types.
                    // However, for the chat UI, we want to know if it's text.
                    // Let's modify the return type or handle hybrid messages higher up.
                    // For A2UI compliance, we'll just extract data parts. 
                    // But wait, the user wants Chat + UI.
                }
            }
            // Let's return RAW parts so the UI can decide how to render (Text vs Data)
            // We will need to adjust the return signature.
            return messages;
        }
        return [];
    }
    /**
     * Version that returns raw parts (Text + Data) for the chat UI
     */
    async sendChat(message) {
        const client = await this.#getClient();
        let parts = [];
        if (typeof message === 'string') {
            parts = [{ kind: "text", text: message }];
        }
        else {
            parts = [{
                    kind: "data",
                    data: message,
                    mimeType: A2UI_MIME_TYPE,
                }];
        }
        const response = await client.sendMessage({
            message: {
                messageId: crypto.randomUUID(),
                role: "user",
                parts: parts,
                kind: "message",
            },
        });
        if ("error" in response) {
            throw new Error(response.error.message);
        }
        const result = response.result;
        if (result.kind === "task" && result.status.message?.parts) {
            return result.status.message.parts;
        }
        return [];
    }
}
//# sourceMappingURL=client.js.map