import { LitElement } from "lit";
declare const ChatMessage_base: typeof LitElement;
export declare class ChatMessage extends ChatMessage_base {
    role: "user" | "model";
    text: string | null;
    static styles: import("lit").CSSResult;
    private copyToClipboard;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
//# sourceMappingURL=chat-message.d.ts.map