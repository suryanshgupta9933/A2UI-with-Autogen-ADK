
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("chat-input")
export class ChatInput extends LitElement {
    @property({ type: Boolean }) disabled = false;

    static styles = css`
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
  `;

    private _handleSubmit(e: Event) {
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
        return html`
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
}
