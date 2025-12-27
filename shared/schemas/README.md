# Riverrun Schemas

This directory contains shared schema definitions for the Riverrun case management framework.

## Structure

- `case-types/` - Case type definitions (YAML/JSON)
- `workflows/` - Workflow state machine definitions
- `forms/` - Form schemas (JSON Schema)
- `rules/` - Business rule definitions
- `api/` - OpenAPI specifications

## Schema Format Examples

### Case Type Definition
```yaml
caseType:
  id: incident-management
  name: Incident Management
  description: Handle security incidents
  metadata:
    category: security
  states:
    - NEW
    - IN_PROGRESS
    - RESOLVED
    - CLOSED
  customFields:
    - name: severity
      type: enum
      values: [LOW, MEDIUM, HIGH, CRITICAL]
    - name: affectedSystems
      type: array
```

### Workflow Definition
```yaml
workflow:
  id: incident-workflow
  name: Incident Workflow
  initialState: NEW
  states:
    NEW:
      transitions:
        - to: IN_PROGRESS
          guards:
            - rule: hasAssignee
        - to: CLOSED
          guards:
            - rule: isDuplicate
    IN_PROGRESS:
      transitions:
        - to: RESOLVED
          guards:
            - rule: hasResolutionNotes
    RESOLVED:
      transitions:
        - to: CLOSED
          guards:
            - rule: isApprovedByManager
        - to: IN_PROGRESS
          guards:
            - rule: requiresMoreWork
```

### Form Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Incident Form",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 5
    },
    "description": {
      "type": "string"
    },
    "severity": {
      "type": "string",
      "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    }
  },
  "required": ["title", "severity"]
}
```
