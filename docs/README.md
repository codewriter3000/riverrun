# Riverrun Documentation

## Overview

Riverrun is a medium-code case management framework that provides more structure than barebones Java Spring Boot/React/Postgres stacks, while maintaining more flexibility than low-code platforms like Pega or ServiceNow.

## Architecture

### Backend (Spring Boot)
- REST API for case management operations
- JPA/Hibernate for data persistence
- PostgreSQL database
- Liquibase for schema migrations
- Custom workflow state machine with rule-based transitions

### Frontend (React + Vite)
- Modern React with TypeScript
- React Router for navigation
- TanStack Query for data fetching
- Component-based architecture

### Core Components

1. **Case Management** - Create, update, search, and manage cases
2. **Task Management** - Assign and track tasks within cases
3. **Workflow Engine** - State machine with rule-based transitions
4. **Form Builder** - Dynamic form rendering from JSON schemas
5. **User & Role Management** - Authentication and authorization
6. **Audit Trail** - Track all changes to cases and tasks

## Configuration

Riverrun uses declarative configuration for customization:

- **Case Type Definitions** - Define custom case types via YAML
- **Workflow DSL** - Configure state machines and transitions
- **Form Schemas** - JSON Schema-based form definitions
- **Business Rules** - Rule-based guards and actions

## Extension Points

- Custom business logic via plugin architecture
- REST API extensions
- UI component overrides
- Database migrations for custom fields

## Getting Started

See [setup.md](setup.md) for installation and configuration instructions.
