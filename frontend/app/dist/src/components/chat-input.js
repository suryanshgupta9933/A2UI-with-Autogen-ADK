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
      display: flex;
      gap: 8px;
      width: 100%;
    }

    input {
      flex: 1;
      padding: 12px;
      border-radius: 24px;
      border: 1px solid #333;
      background-color: #333;
      color: white;
      font-size: 1rem;
      outline: none;
    }

    input:focus {
      border-color: #0078d4;
    }

    button {
      padding: 0 20px;
      border-radius: 24px;
      border: none;
      background-color: #0078d4;
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
      background-color: #106ebe;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `; }
    _handleSubmit(e) {
        e.preventDefault();
        const input = this.shadowRoot?.querySelector("input");
        if (input && input.value.trim()) {
            this.dispatchEvent(new CustomEvent("send-message", {
                detail: { text: input.value },
                bubbles: true,
                composed: true
            }));
            input.value = "";
        }
    }
    render() {
        return html `
      <form style="display:contents" @submit=${this._handleSubmit}>
        <input 
            type="text" 
            placeholder="Type a message..." 
            ?disabled=${this.disabled}
        />
        <button type="submit" ?disabled=${this.disabled}>Send</button>
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