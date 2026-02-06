
import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { v0_8 } from "@a2ui/lit";
import { repeat } from "lit/directives/repeat.js";

// We need to import the core renderer elements


// Since I deleted the local 'ui' folder which likely re-exported specific components, 
// I should rely on the library's exports or re-create a simple registry. 
// For now, let's assume importing @a2ui/lit/ui registers them or I need to import them individually.
import * as UI from "@a2ui/lit/ui";
// Let's assume the previous app element imported "./ui/ui.js" which was local.
// I will create a new src/ui-registry.ts to import standard components.

@customElement("chat-message")
export class ChatMessage extends LitElement {
  @property({ type: String }) role: "user" | "model" = "user";
  @property({ type: String }) text: string | null = null;
  @property({ type: Object }) a2uiData: v0_8.Types.ServerToClientMessage[] | null = null;
  @property({ type: Object }) processor: any = null; // A2UI Signal Processor

  static styles = css`
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
  `;

  render() {
    return html`
      ${this.text ? html`<div class="bubble">${this.text}</div>` : nothing}
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
    if (!this.processor) return nothing;

    // We assume the parent already fed the messages to the processor.
    // We just render the surfaces that belong to *this* interaction? 
    // A2UI usually updates a specific surfaceId.

    return html`
      <div class="a2ui-container">
         ${repeat(
      this.processor.getSurfaces(),
      ([id]) => id,
      ([id, surface]) => html`
             <a2ui-surface
               .surfaceId=${id}
               .surface=${surface}
               .processor=${this.processor}
             ></a2ui-surface>
           `
    )}
      </div>
    `;
  }
}
