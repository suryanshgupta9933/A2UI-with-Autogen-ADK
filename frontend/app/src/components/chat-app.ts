
import { LitElement, html, css, nothing, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { v0_8 } from "@a2ui/lit";
import { A2UIClientService } from "../services/client.js";
import { chatStyles } from "../styles/theme.js";
import { repeat } from "lit/directives/repeat.js";

// Import components
import "./chat-input.js";
// We define chat-message inline or import it. Ideally import.
import "./chat-message.js";

// A2UI Core
import * as UI from "@a2ui/lit/ui"; // This imports the default UI components?
// Note: In the previous app.ts, they imported "./ui/ui.js" which was local.
// We need to ensure the standard components like a2ui-surface are registered.
// Since we are using @a2ui/lit, we might need to rely on what it exports or creating a registration file.
// For now, let's assume importing @a2ui/lit registers the core, but specific components might need to affect the registry.
// If 'a2ui-surface' is not registered, we have a problem.
// Let's create a minimal registry import.



interface ChatItem {
    id: string;
    role: "user" | "model";
    text?: string;
    processor?: any; // A2UI processor for this message group
}

@customElement("chat-app")
export class ChatApp extends LitElement {
    static styles = [css`${unsafeCSS(chatStyles)}`];

    private client = new A2UIClientService();

    @state() messages: ChatItem[] = [{
        id: "welcome",
        role: "model",
        text: "Hello! I am your AI assistant. How can I help you today?"
    }];

    @state() loading = false;

    // Single global processor for now? 
    // If we want conversational history of UI, maintaining state is complex.
    // Let's create a new processor for EACH response that contains UI data.
    // This allows multiple UI bubbles to exist independently (static snapshot) OR
    // updates to apply to the latest one.
    // Real A2UI is stateful per Surface ID. If the agent updates Surface A, 
    // wherever Surface A is rendered, it should update.

    // So, let's use a GLOBAL processor map or a single processor.
    // Single processor is easier.
    private globalProcessor = v0_8.Data.createSignalA2uiMessageProcessor();

    async handleSend(e: CustomEvent) {
        const text = e.detail.text;
        if (!text) return;

        // Add user message
        this.messages = [...this.messages, {
            id: crypto.randomUUID(),
            role: "user",
            text
        }];

        this.loading = true;
        try {
            const parts = await this.client.sendChat(text);

            let responseText = "";
            let hasData = false;

            // Process parts
            const dataMessages: any[] = [];

            for (const part of parts) {
                if (part.kind === "text") {
                    responseText += part.text;
                } else if (part.kind === "data") {
                    hasData = true;
                    dataMessages.push(part.data);
                }
            }

            // If we have data, process it into the global processor
            if (hasData) {
                this.globalProcessor.processMessages(dataMessages);
            }

            // Add model message
            this.messages = [...this.messages, {
                id: crypto.randomUUID(),
                role: "model",
                text: responseText || (hasData ? "Generated UI:" : "No response text."),
                processor: hasData ? this.globalProcessor : undefined
            }];

        } catch (err) {
            console.error(err);
            this.messages = [...this.messages, {
                id: crypto.randomUUID(),
                role: "model",
                text: "Error: Failed to get response."
            }];
        } finally {
            this.loading = false;
        }
    }

    // Handle A2UI actions bubbling up
    // We need to listen to 'a2uiaction' event on the surfaces.
    // Since surfaces are deeply nested, we listen on the host?
    // Lit events bubble.

    async handleA2UIAction(e: any) {
        // This logic mirrors the previous app.ts action handling
        const surfaceId = e.detail.surfaceId || e.target.surfaceId;
        // ... extract context ...
        // ... send userAction message ...
        // We define this on the component level to capture the event.
    }

    render() {
        return html`
      <header>
        <h1>A2UI Chat</h1>
      </header>
      
      <div class="chat-history">
        ${repeat(this.messages, (m) => m.id, (m) => html`
            <chat-message 
                .role=${m.role} 
                .text=${m.text}
                .processor=${m.processor}
            ></chat-message>
        `)}
        ${this.loading ? html`<div style="color:#666; font-style:italic">Thinking...</div>` : nothing}
      </div>

      <div class="input-area">
        <chat-input 
            ?disabled=${this.loading}
            @send-message=${this.handleSend}
        ></chat-input>
      </div>
    `;
    }
}
