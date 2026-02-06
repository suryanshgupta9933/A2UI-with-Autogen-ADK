import { LitElement } from "lit";
import "./chat-input.js";
import "./chat-message.js";
interface ChatItem {
    id: string;
    role: "user" | "model";
    text?: string;
    processor?: any;
}
export declare class ChatApp extends LitElement {
    static styles: import("lit").CSSResult[];
    private client;
    messages: ChatItem[];
    loading: boolean;
    private globalProcessor;
    handleSend(e: CustomEvent): Promise<void>;
    handleA2UIAction(e: any): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
//# sourceMappingURL=chat-app.d.ts.map