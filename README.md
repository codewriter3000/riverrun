# Riverrun

A medium-code case management framework that bridges the gap between low-level Spring Boot/React stacks and enterprise low-code platforms like Pega and ServiceNow.

## Overview

Riverrun provides pre-built case management primitives with developer-friendly customization points, declarative configuration, and sensible defaults. Build case management applications faster without sacrificing flexibility.

## Features

- 📋 **Case Management** - Full lifecycle management of cases with custom fields
- ✅ **Task Management** - Assign, track, and complete tasks within cases
- 🔄 **Workflow Engine** - Custom state machine with rule-based transitions
- 📝 **Form Builder** - Dynamic form rendering from JSON schemas
- 👥 **User & Role Management** - Built-in authentication and authorization
- 📊 **Audit Trail** - Complete history of case and task changes
- 🔌 **Extension Points** - Plugin architecture for custom business logic

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.2
- PostgreSQL
- Liquibase
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- TanStack Query

## Project Structure

```
river-run/
├── backend/          # Spring Boot application
│   └── src/
│       ├── main/
│       │   ├── java/io/riverrun/
│       │   │   ├── api/         # REST controllers & DTOs
│       │   │   ├── domain/      # Entities, repositories, services
│       │   │   ├── workflow/    # State machine engine
│       │   │   └── config/      # Spring configuration
│       │   └── resources/
│       │       ├── db/          # Liquibase migrations
│       │       └── application.yml
│       └── test/
├── frontend/         # React application
│   └── src/
│       ├── components/
│       ├── services/
│       ├── types/
│       └── hooks/
├── shared/           # Shared schemas and definitions
│   └── schemas/
│       ├── case-types/
│       ├── workflows/
│       ├── forms/
│       └── rules/
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.9+

### Setup Database

```sql
CREATE DATABASE riverrun;
CREATE USER riverrun WITH PASSWORD 'riverrun';
GRANT ALL PRIVILEGES ON DATABASE riverrun TO riverrun;
```

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at http://localhost:8080/api

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000

## Configuration

Riverrun uses declarative YAML/JSON configuration for customization:

### Define Case Types

```yaml
# shared/schemas/case-types/incident.yml
caseType:
  id: incident-management
  name: Incident Management
  customFields:
    - name: severity
      type: enum
      values: [LOW, MEDIUM, HIGH, CRITICAL]
```

### Configure Workflows

```yaml
# shared/schemas/workflows/incident-workflow.yml
workflow:
  id: incident-workflow
  initialState: NEW
  states:
    NEW:
      transitions:
        - to: IN_PROGRESS
          guards:
            - rule: hasAssignee
```

### Create Forms

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Incident Form",
  "properties": {
    "title": { "type": "string" },
    "severity": { "type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }
  }
}
```

## Documentation

See the [docs](docs/) directory for:
- Architecture overview
- API documentation
- Configuration guides
- Extension development

## Development Roadmap

- [x] Project scaffolding
- [x] Basic domain model (User, Role)
- [ ] Core case management entities
- [ ] Workflow state machine engine
- [ ] Form builder and renderer
- [ ] API endpoints
- [ ] Frontend UI components
- [ ] Plugin architecture
- [ ] Configuration loader

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines first.
