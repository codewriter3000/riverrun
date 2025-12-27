# Plan: Build Riverrun Case Management Framework

A greenfield medium-code case management framework bridging the gap between low-level Spring Boot/React stacks and enterprise low-code platforms. Riverrun will provide pre-built case management primitives (cases, tasks, workflows, forms, roles) with developer-friendly customization points, declarative configuration, and sensible defaults.

## Steps

1. **Establish project structure** - Create monorepo with backend (Spring Boot), frontend (React), shared schema definitions, and documentation folders
2. **Define core domain model** - Design case, task, workflow, user, role, and audit entities with extensible metadata fields for customization
3. **Build backend foundation** - Implement REST API with Spring Boot, Postgres integration, authentication/authorization framework, and workflow engine hooks
4. **Create frontend scaffolding** - Set up React app with case list/detail views, task management UI, form builder/renderer, and role-based navigation
5. **Implement configuration layer** - Design YAML/JSON-based case type definitions, workflow DSL, form schemas, and validation rules that generate runtime behavior
6. **Add extension points** - Create plugin architecture for custom business logic, REST API extensions, UI component overrides, and database migrations

## Decisions

### Workflow Engine: Hybrid Approach ✓

**Custom state machine with rule-based transition guards**

Starting with a lightweight custom state machine for core workflow functionality, enhanced with rule-based guards for flexible business logic. This provides:
- Simple linear workflows out of the box
- Flexibility for complex conditional logic
- Lightweight feel appropriate for medium-code positioning
- Ability to add BPMN import/export later as an advanced feature

Reserve Camunda integration as an optional plugin for enterprises needing complex orchestration.

## Further Considerations

1. **Form builder complexity** - Start with JSON schema forms or build visual drag-drop designer initially?
2. **Multi-tenancy** - Plan for single-tenant first or architect for multi-tenancy from the start?
3. **Deployment model** - Target on-premises, cloud-native, or both? Affects configuration and architecture choices.