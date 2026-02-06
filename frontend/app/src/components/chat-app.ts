import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { SignalWatcher } from "@lit-labs/signals";
import { v0_8 } from "@a2ui/lit";
import { A2UIClientService } from "../services/client.js";
import { darkTheme, lightTheme } from "../styles/theme.js";
import { repeat } from "lit/directives/repeat.js";
import * as UI from "@a2ui/lit/ui";

// Import components
import "./chat-input.js";
import "./chat-message.js";

interface ChatItem {
    id: string;
    role: "user" | "model";
    text?: string;
}

@customElement("chat-app")
export class ChatApp extends SignalWatcher(LitElement) {
    static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    * {
      box-sizing: border-box;
    }

    :host {
      display: flex;
      height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Left Panel - Chat (Light Theme) */
    .chat-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      min-width: 0;
    }

    .panel-header {
      display: flex;
      align-items: center;
      padding: 20px 24px;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
    }

    .panel-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .panel-title::before {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .chat-panel .panel-title::before {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }

    .artifacts-panel .panel-title::before {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .artifacts-panel .panel-title {
      color: #111827;
    }

    .chat-history {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background: #fafafa;
    }

    .input-area {
      padding: 20px 24px;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #6b7280;
      font-size: 0.9375rem;
      padding: 16px 20px;
      background: #f3f4f6;
      border-radius: 12px;
      font-weight: 500;
    }

    .loading-indicator::before {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid #e5e7eb;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Right Panel - Artifacts */
    .artifacts-panel {
      width: 45%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
    }

    .artifacts-panel .panel-header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      border-left: 1px solid #e5e7eb;
    }

    .artifacts-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #f1f5f9;
    }

    .empty-artifacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #9ca3af;
      text-align: center;
      padding: 40px;
    }

    .empty-icon {
      width: 72px;
      height: 72px;
      margin-bottom: 20px;
      opacity: 0.4;
    }

    .empty-title {
      font-size: 1.0625rem;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .empty-desc {
      font-size: 0.9375rem;
      color: #9ca3af;
    }

    .artifact-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .artifact-card-header {
      padding: 14px 20px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .artifact-card-header::before {
      content: '✨';
      font-size: 1rem;
    }

    .artifact-card-content {
      padding: 24px;
    }

    /* Scrollbar styling */
    .chat-history::-webkit-scrollbar,
    .artifacts-content::-webkit-scrollbar {
      width: 6px;
    }

    .chat-history::-webkit-scrollbar-track,
    .artifacts-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-history::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .artifacts-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
  `;

    @provide({ context: UI.Context.themeContext })
    @state()
    theme: v0_8.Types.Theme = darkTheme;

    private client = new A2UIClientService();

    @state() messages: ChatItem[] = [
        {
            id: "welcome",
            role: "model",
            text: "Hello! I can generate UI components for you. Try asking for a weather widget, contact form, or any other UI element.",
        },
    ];

    @state() loading = false;

    private globalProcessor = v0_8.Data.createSignalA2uiMessageProcessor();
    private lightProcessor = v0_8.Data.createSignalA2uiMessageProcessor();

    async handleSend(e: CustomEvent) {
        const text = e.detail.text;
        if (!text) return;

        this.messages = [
            ...this.messages,
            { id: crypto.randomUUID(), role: "user", text },
        ];

        this.loading = true;
        try {
            const parts = await this.client.sendChat(text);

            let responseText = "";
            let hasData = false;
            const dataMessages: any[] = [];

            for (const part of parts) {
                if (part.kind === "text") {
                    responseText += part.text;
                } else if (part.kind === "data") {
                    hasData = true;
                    dataMessages.push(part.data);
                }
            }

            if (hasData) {
                console.log("Processing A2UI data:", dataMessages);
                this.globalProcessor.clearSurfaces();
                this.globalProcessor.processMessages(dataMessages);
                this.lightProcessor.clearSurfaces();
                this.lightProcessor.processMessages(dataMessages);
            }

            this.messages = [
                ...this.messages,
                {
                    id: crypto.randomUUID(),
                    role: "model",
                    text: responseText || (hasData ? "I've generated a UI component for you. Check the Artifacts panel →" : "No response."),
                },
            ];
        } catch (err) {
            console.error(err);
            this.messages = [
                ...this.messages,
                { id: crypto.randomUUID(), role: "model", text: "Error: Failed to get response." },
            ];
        } finally {
            this.loading = false;
        }
    }

    render() {
        const surfaces = this.lightProcessor.getSurfaces();
        const hasSurfaces = surfaces.size > 0;

        return html`
      <!-- Left: Chat Panel -->
      <div class="chat-panel">
        <div class="panel-header">
          <span class="panel-title">Chat</span>
        </div>

        <div class="chat-history">
          ${repeat(
            this.messages,
            (m) => m.id,
            (m) => html`<chat-message .role=${m.role} .text=${m.text}></chat-message>`
        )}
          ${this.loading ? html`<div class="loading-indicator">Generating response...</div>` : nothing}
        </div>

        <div class="input-area">
          <chat-input ?disabled=${this.loading} @send-message=${this.handleSend}></chat-input>
        </div>
      </div>

      <!-- Right: Artifacts Panel -->
      <div class="artifacts-panel">
        <div class="panel-header">
          <span class="panel-title">Artifacts</span>
        </div>

        <div class="artifacts-content">
          ${hasSurfaces
                ? html`
                <div class="artifact-card">
                  <div class="artifact-card-content">
                    <artifact-renderer .processor=${this.lightProcessor}></artifact-renderer>
                  </div>
                </div>
              `
                : html`
                <div class="empty-artifacts">
                  <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <div class="empty-title">No artifacts yet</div>
                  <div class="empty-desc">Generated UI components will appear here</div>
                </div>
              `}
        </div>
      </div>
    `;
    }
}

@customElement("artifact-renderer")
export class ArtifactRenderer extends SignalWatcher(LitElement) {
    @provide({ context: UI.Context.themeContext })
    @state()
    theme: v0_8.Types.Theme = lightTheme;

    @state() processor: any = null;

    static styles = css`
    :host {
      display: block;
    }
    a2ui-surface {
      display: block;
      width: 100%;
    }
  `;

    render() {
        if (!this.processor) return nothing;

        const surfaces = this.processor.getSurfaces();
        return html`
      ${repeat(
            surfaces,
            ([id]) => id,
            ([id, surface]) => html`
          <a2ui-surface
            .surfaceId=${id}
            .surface=${surface}
            .processor=${this.processor}
          ></a2ui-surface>
        `
        )}
    `;
    }
}
