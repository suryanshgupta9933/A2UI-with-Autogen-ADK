import { Part } from "@a2a-js/sdk";
import { v0_8 } from "@a2ui/lit";
export declare class A2UIClientService {
    #private;
    constructor(serverUrl?: string);
    send(message: v0_8.Types.A2UIClientEventMessage | string): Promise<v0_8.Types.ServerToClientMessage[]>;
    /**
     * Version that returns raw parts (Text + Data) for the chat UI
     */
    sendChat(message: v0_8.Types.A2UIClientEventMessage | string): Promise<Part[]>;
}
//# sourceMappingURL=client.d.ts.map