from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union

class ClientCapabilities(BaseModel):
    """
    Defines the A2UI capabilities supported by the client.
    """
    supportedCatalogIds: List[str] = Field(default_factory=list)
    inlineCatalogs: Optional[List[Dict[str, Any]]] = None

class UserAction(BaseModel):
    """
    Represents a user interaction event sent from the client.
    """
    name: str
    surfaceId: str
    sourceComponentId: str
    timestamp: str
    context: Dict[str, Any] = Field(default_factory=dict)

class MessagePart(BaseModel):
    """
    A unified model for message parts (Text or Data).
    """
    kind: Optional[str] = None  # text or data
    text: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

    def is_text(self) -> bool:
        return self.kind == "text" or (self.text is not None and self.data is None)

    def is_user_action(self) -> bool:
        return self.kind == "data" and self.data is not None and "userAction" in self.data

    def get_user_action(self) -> Optional[UserAction]:
        if self.is_user_action():
            return UserAction(**self.data["userAction"])
        return None

class A2AClientMessage(BaseModel):
    messageId: str
    role: str
    parts: List[MessagePart]
    kind: str

class JsonRpcParams(BaseModel):
    message: A2AClientMessage

class JsonRpcRequest(BaseModel):
    jsonrpc: str
    method: str
    params: JsonRpcParams
    id: Union[int, str]

    def get_query_text(self) -> str:
        parts_text = []
        for part in self.params.message.parts:
            if part.is_text():
                parts_text.append(part.text)
            elif part.is_user_action():
                action = part.get_user_action()
                parts_text.append(
                    f"[SYSTEM_EVENT] User triggered action '{action.name}' "
                    f"on surface '{action.surfaceId}' with context: {action.context}"
                )
        return "\n".join(parts_text) if parts_text else "Empty request"

class JsonRpcResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: Union[int, str]
    result: Dict[str, Any]
