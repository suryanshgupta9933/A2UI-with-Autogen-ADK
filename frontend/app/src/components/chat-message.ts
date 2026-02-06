import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SignalWatcher } from "@lit-labs/signals";

@customElement("chat-message")
export class ChatMessage extends SignalWatcher(LitElement) {
  @property({ type: String }) role: "user" | "model" = "user";
  @property({ type: String }) text: string | null = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message-row {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }

    :host([role="user"]) .message-row {
      flex-direction: row-reverse;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    :host([role="user"]) .avatar {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
    }

    :host([role="model"]) .avatar {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
    }

    .message-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }

    :host([role="user"]) .message-content {
      align-items: flex-end;
    }

    .role-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .bubble {
      padding: 14px 18px;
      border-radius: 16px;
      font-size: 1rem;
      line-height: 1.6;
      white-space: pre-wrap;
      max-width: 85%;
    }

    :host([role="user"]) .bubble {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
    }

    :host([role="model"]) .bubble {
      background: #ffffff;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .message-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: transparent;
      border: none;
      color: #9ca3af;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s;
    }

    .action-btn:hover {
      background: #f3f4f6;
      color: #6b7280;
    }

    .action-btn svg {
      width: 14px;
      height: 14px;
    }
  `;

  private copyToClipboard() {
    if (this.text) {
      navigator.clipboard.writeText(this.text);
    }
  }

  render() {
    const roleLabel = this.role === "user" ? "You" : "Assistant";
    const avatarText = this.role === "user" ? "Y" : "AI";

    return html`
      <div class="message-row">
        <div class="avatar">${avatarText}</div>
        <div class="message-content">
          <span class="role-label">${roleLabel}</span>
          ${this.text ? html`<div class="bubble">${this.text}</div>` : nothing}
          ${this.role === "model" && this.text
        ? html`
                <div class="message-actions">
                  <button class="action-btn" @click=${this.copyToClipboard}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </button>
                </div>
              `
        : nothing}
        </div>
      </div>
    `;
  }
}
