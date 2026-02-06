var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
// Let's assume the previous app element imported "./ui/ui.js" which was local.
// I will create a new src/ui-registry.ts to import standard components.
let ChatMessage = class ChatMessage extends LitElement {
    constructor() {
        super(...arguments);
        this.role = "user";
        this.text = null;
        this.a2uiData = null;
        this.processor = null; // A2UI Signal Processor
    }
    static { this.styles = css `
    :host {
      display: flex;
      flex-direction: column;
      max-width: 80%;
      margin-bottom: 8px;
    }

    :host([role="user"]) {
      align-self: flex-end;
      align-items: flex-end;
    }

    :host([role="model"]) {
      align-self: flex-start;
      align-items: flex-start;
    }

    .bubble {
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 1rem;
      line-height: 1.5;
    }

    :host([role="user"]) .bubble {
      background-color: #0078d4;
      color: white;
      border-bottom-right-radius: 2px;
    }

    :host([role="model"]) .bubble {
      background-color: #333;
      color: #e0e0e0;
      border-bottom-left-radius: 2px;
    }

    .a2ui-container {
      width: 100%;
      margin-top: 8px;
    }
  `; }
    render() {
        return html `
      ${this.text ? html `<div class="bubble">${this.text}</div>` : nothing}
      ${this.a2uiData && this.processor ? this.renderA2UI() : nothing}
    `;
    }
    renderA2UI() {
        // Process messages into surfaces using the passed processor
        // Note: The parent should probably manage the processor state provided to this message 
        // OR this message uses a temporary one. 
        // However, A2UI requires a persistent processor for updates.
        // For a simple chat, we might treat each message as a self-contained unit 
        // OR share one processor for the whole chat.
        // If sharing, the parent creates surfaces. Let's assume the parent passes data ready to render 
        // OR we pass the processor and surfaceId.
        // Simplification: We assume the parent handles the processor and passes "surfaces" to render.
        // Actually, let's keep it simple: passed processor has the state.
        // If we have data, we ask the processor?
        // This is tricky. A2UI is stateful.
        // Let's defer A2UI rendering loop to the parent app for now, 
        // or use a <a2ui-surface> with a specific surface ID computed for this message.
        // For this POC, we'll try to iterate the processor's surfaces.
        if (!this.processor)
            return nothing;
        // We assume the parent already fed the messages to the processor.
        // We just render the surfaces that belong to *this* interaction? 
        // A2UI usually updates a specific surfaceId.
        return html `
      <div class="a2ui-container">
         ${repeat(this.processor.getSurfaces(), ([id]) => id, ([id, surface]) => html `
             <a2ui-surface
               .surfaceId=${id}
               .surface=${surface}
               .processor=${this.processor}
             ></a2ui-surface>
           `)}
      </div>
    `;
    }
};
__decorate([
    property({ type: String })
], ChatMessage.prototype, "role", void 0);
__decorate([
    property({ type: String })
], ChatMessage.prototype, "text", void 0);
__decorate([
    property({ type: Object })
], ChatMessage.prototype, "a2uiData", void 0);
__decorate([
    property({ type: Object })
], ChatMessage.prototype, "processor", void 0);
ChatMessage = __decorate([
    customElement("chat-message")
], ChatMessage);
export { ChatMessage };
//# sourceMappingURL=chat-message.js.map