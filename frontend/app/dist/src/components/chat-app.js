var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let ChatApp = class ChatApp extends LitElement {
    constructor() {
        super(...arguments);
        this.client = new A2UIClientService();
        this.messages = [{
                id: "welcome",
                role: "model",
                text: "Hello! I am your AI assistant. How can I help you today?"
            }];
        this.loading = false;
        // Single global processor for now? 
        // If we want conversational history of UI, maintaining state is complex.
        // Let's create a new processor for EACH response that contains UI data.
        // This allows multiple UI bubbles to exist independently (static snapshot) OR
        // updates to apply to the latest one.
        // Real A2UI is stateful per Surface ID. If the agent updates Surface A, 
        // wherever Surface A is rendered, it should update.
        // So, let's use a GLOBAL processor map or a single processor.
        // Single processor is easier.
        this.globalProcessor = v0_8.Data.createSignalA2uiMessageProcessor();
    }
    static { this.styles = [css `${unsafeCSS(chatStyles)}`]; }
    async handleSend(e) {
        const text = e.detail.text;
        if (!text)
            return;
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
            const dataMessages = [];
            for (const part of parts) {
                if (part.kind === "text") {
                    responseText += part.text;
                }
                else if (part.kind === "data") {
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
        }
        catch (err) {
            console.error(err);
            this.messages = [...this.messages, {
                    id: crypto.randomUUID(),
                    role: "model",
                    text: "Error: Failed to get response."
                }];
        }
        finally {
            this.loading = false;
        }
    }
    // Handle A2UI actions bubbling up
    // We need to listen to 'a2uiaction' event on the surfaces.
    // Since surfaces are deeply nested, we listen on the host?
    // Lit events bubble.
    async handleA2UIAction(e) {
        // This logic mirrors the previous app.ts action handling
        const surfaceId = e.detail.surfaceId || e.target.surfaceId;
        // ... extract context ...
        // ... send userAction message ...
        // We define this on the component level to capture the event.
    }
    render() {
        return html `
      <header>
        <h1>A2UI Chat</h1>
      </header>
      
      <div class="chat-history">
        ${repeat(this.messages, (m) => m.id, (m) => html `
            <chat-message 
                .role=${m.role} 
                .text=${m.text}
                .processor=${m.processor}
            ></chat-message>
        `)}
        ${this.loading ? html `<div style="color:#666; font-style:italic">Thinking...</div>` : nothing}
      </div>

      <div class="input-area">
        <chat-input 
            ?disabled=${this.loading}
            @send-message=${this.handleSend}
        ></chat-input>
      </div>
    `;
    }
};
__decorate([
    state()
], ChatApp.prototype, "messages", void 0);
__decorate([
    state()
], ChatApp.prototype, "loading", void 0);
ChatApp = __decorate([
    customElement("chat-app")
], ChatApp);
export { ChatApp };
//# sourceMappingURL=chat-app.js.map