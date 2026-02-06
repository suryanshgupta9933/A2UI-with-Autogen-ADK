/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { A2AClient } from "@a2a-js/sdk/client";
const A2UI_MIME_TYPE = "application/json+a2ui";
export class A2UIClient {
    #serverUrl;
    #client = null;
    constructor(serverUrl = "") {
        this.#serverUrl = serverUrl;
    }
    #ready = Promise.resolve();
    get ready() {
        return this.#ready;
    }
    async #getClient() {
        if (!this.#client) {
            // Default to localhost:8000 if no URL provided (fallback for restaurant app default)
            const baseUrl = this.#serverUrl || "http://localhost:8000";
            console.log(`[A2UI Client] Initializing client. Base URL: ${baseUrl}`);
            try {
                console.log(`[A2UI Client] Fetching agent card from: ${baseUrl}/.well-known/agent-card.json`);
                this.#client = await A2AClient.fromCardUrl(`${baseUrl}/.well-known/agent-card.json`, {
                    fetchImpl: async (url, init) => {
                        console.log(`[A2UI Client] Fetching: ${url}`);
                        const headers = new Headers(init?.headers);
                        headers.set("X-A2A-Extensions", "https://a2ui.org/a2a-extension/a2ui/v0.8");
                        return fetch(url, { ...init, headers });
                    }
                });
                console.log("[A2UI Client] Client successfully initialized.");
            }
            catch (e) {
                console.error("[A2UI Client] Failed to initialize client:", e);
                throw e;
            }
        }
        return this.#client;
    }
    async send(message) {
        console.log("[A2UI Client] Preparing to send message. Payload:", message);
        try {
            const client = await this.#getClient();
            let parts = [];
            if (typeof message === 'string') {
                // Try to parse as JSON first, just in case
                try {
                    const parsed = JSON.parse(message);
                    if (typeof parsed === 'object' && parsed !== null) {
                        parts = [{
                                kind: "data",
                                data: parsed,
                                mimeType: A2UI_MIME_TYPE,
                            }];
                    }
                    else {
                        parts = [{ kind: "text", text: message }];
                    }
                }
                catch {
                    parts = [{ kind: "text", text: message }];
                }
            }
            else {
                parts = [{
                        kind: "data",
                        data: message,
                        mimeType: A2UI_MIME_TYPE,
                    }];
            }
            console.log("[A2UI Client] Parts constructed:", JSON.stringify(parts, null, 2));
            console.log("[A2UI Client] Calling client.sendMessage...");
            const response = await client.sendMessage({
                message: {
                    messageId: crypto.randomUUID(),
                    role: "user",
                    parts: parts,
                    kind: "message",
                },
            });
            console.log("[A2UI Client] sendMessage returned:", response);
            if ("error" in response) {
                console.error("[A2UI Client] Response contained error:", response.error);
                throw new Error(response.error.message);
            }
            const result = response.result;
            if (result.kind === "task" && result.status.message?.parts) {
                const messages = [];
                for (const part of result.status.message.parts) {
                    if (part.kind === 'data') {
                        messages.push(part.data);
                    }
                }
                return messages;
            }
            return [];
        }
        catch (e) {
            console.error("[A2UI Client] Critical error in send():", e);
            throw e;
        }
    }
}
//# sourceMappingURL=client.js.map