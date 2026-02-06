import { LitElement, nothing } from "lit";
import { v0_8 } from "@a2ui/lit";
export declare class ChatMessage extends LitElement {
    role: "user" | "model";
    text: string | null;
    a2uiData: v0_8.Types.ServerToClientMessage[] | null;
    processor: any;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    renderA2UI(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=chat-message.d.ts.map