class A2UIError(Exception):
    """Base exception for A2UI backend errors."""
    pass

class A2UIValidationError(A2UIError):
    """Raised when A2UI JSON payload fails validation."""
    pass

class AgentError(A2UIError):
    """Raised when the agent fails to generate a valid response."""
    pass
