import json
from jsonschema import validate, ValidationError

from .schema import A2UI_SCHEMA

from core.exceptions import A2UIValidationError
from core.logger import configure_logger

logger = configure_logger("a2ui.validator")

def validate_a2ui_payload(payload: list[dict]):
    """
    Validates a list of A2UI messages against the schema.
    
    Args:
        payload: The list of A2UI messages to validate.
        
    Raises:
        A2UIValidationError: If any message in the payload is invalid.
    """
    if not isinstance(payload, list):
        raise A2UIValidationError("A2UI payload must be a list of messages.")
        
    for i, message in enumerate(payload):
        try:
            validate(instance=message, schema=A2UI_SCHEMA)
            
            # Additional validation logic (beyond schema) can go here
            # e.g., checking for valid surfaceIds, component IDs, etc.
            
        except ValidationError as e:
            logger.error(f"Validation failed for message {i}: {e.message}")
            raise A2UIValidationError(f"Invalid A2UI message at index {i}: {e.message}") from e

    logger.info(f"Successfully validated {len(payload)} A2UI messages.")
