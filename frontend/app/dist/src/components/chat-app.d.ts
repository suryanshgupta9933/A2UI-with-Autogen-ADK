import { LitElement, nothing } from "lit";
import { v0_8 } from "@a2ui/lit";
import "./chat-input.js";
import "./chat-message.js";
interface ChatItem {
    id: string;
    role: "user" | "model";
    text?: string;
}
declare const ChatApp_base: typeof LitElement;
export declare class ChatApp extends ChatApp_base {
    static styles: import("lit").CSSResult;
    theme: v0_8.Types.Theme;
    private client;
    messages: ChatItem[];
    loading: boolean;
    private globalProcessor;
    private lightProcessor;
    handleSend(e: CustomEvent): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
declare const ArtifactRenderer_base: typeof LitElement;
export declare class ArtifactRenderer extends ArtifactRenderer_base {
    theme: v0_8.Types.Theme;
    processor: any;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
export {};
//# sourceMappingURL=chat-app.d.ts.map