var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
let ChatInput = class ChatInput extends LitElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
    static { this.styles = css `
    :host {
      display: block;
      width: 100%;
    }

    form {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      background: #f9fafb;
      padding: 10px 12px 10px 20px;
      border-radius: 28px;
      border: 1px solid #e5e7eb;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    form:focus-within {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      background: #ffffff;
    }

    input {
      flex: 1;
      border: none;
      background: transparent;
      color: #1f2937;
      font-size: 1rem;
      outline: none;
      padding: 8px 0;
      font-family: inherit;
    }

    input::placeholder {
      color: #9ca3af;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }

    button:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    button:active:not(:disabled) {
      transform: scale(0.95);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button svg {
      width: 20px;
      height: 20px;
    }
  `; }
    _handleSubmit(e) {
        e.preventDefault();
        const input = this.shadowRoot?.querySelector("input");
        if (input && input.value.trim()) {
            this.dispatchEvent(new CustomEvent("send-message", {
                detail: { text: input.value },
                bubbles: true,
                composed: true,
            }));
            input.value = "";
        }
    }
    render() {
        return html `
      <form @submit=${this._handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          ?disabled=${this.disabled}
          autocomplete="off"
        />
        <button type="submit" ?disabled=${this.disabled}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    `;
    }
};
__decorate([
    property({ type: Boolean })
], ChatInput.prototype, "disabled", void 0);
ChatInput = __decorate([
    customElement("chat-input")
], ChatInput);
export { ChatInput };
//# sourceMappingURL=chat-input.js.map