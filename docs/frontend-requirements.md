# Riverrun Frontend Requirements - IBM Carbon Design System

This document outlines all frontend components and features to be implemented using the IBM Carbon Design System for the Riverrun case management framework.

## 🎨 Design System

**Use IBM Carbon v11 React components throughout the application.**

- Carbon Components React: `@carbon/react`
- Carbon Icons: `@carbon/icons-react`
- Carbon Themes: Follow Carbon's white theme for light mode, g90/g100 for dark mode
- Typography: Follow Carbon's type scale and tokens
- Spacing: Use Carbon spacing tokens (layout01-layout07)
- Colors: Use Carbon color tokens exclusively

---

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── cases/
│   │   ├── CaseList.tsx
│   │   ├── CaseDataTable.tsx
│   │   ├── CaseDetail.tsx
│   │   ├── CaseForm.tsx
│   │   ├── CaseStatusBadge.tsx
│   │   └── CaseWorkflowPanel.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskCompletionModal.tsx
│   │   └── TaskFilters.tsx
│   ├── forms/
│   │   ├── FormBuilder.tsx
│   │   ├── FormRenderer.tsx
│   │   ├── FormSchemaEditor.tsx
│   │   └── FormValidationDisplay.tsx
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── AppShell.tsx
│   │   └── Breadcrumbs.tsx
│   ├── workflow/
│   │   ├── WorkflowDiagram.tsx
│   │   ├── StateTransitionButton.tsx
│   │   └── AvailableTransitions.tsx
│   ├── audit/
│   │   ├── AuditLogTable.tsx
│   │   └── AuditLogDetail.tsx
│   └── common/
│       ├── LoadingState.tsx
│       ├── ErrorBoundary.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmationModal.tsx
│       └── PageHeader.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── CasesPage.tsx
│   ├── CaseDetailPage.tsx
│   ├── TasksPage.tsx
│   ├── FormsPage.tsx
│   ├── WorkflowsPage.tsx
│   └── AuditPage.tsx
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── case.service.ts
│   ├── task.service.ts
│   ├── form.service.ts
│   └── workflow.service.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useCases.ts
│   ├── useTasks.ts
│   └── usePermissions.ts
├── types/
│   ├── case.types.ts
│   ├── task.types.ts
│   ├── form.types.ts
│   ├── workflow.types.ts
│   └── auth.types.ts
├── utils/
│   ├── dateFormatter.ts
│   ├── statusHelpers.ts
│   └── validators.ts
└── theme/
    └── carbon-theme.scss
```

---

## 🔐 Authentication Components

### LoginForm.tsx

**Carbon Components to Use:**
- `Form`
- `TextInput`
- `PasswordInput`
- `Button` (primary)
- `InlineNotification` (for errors)
- `Loading` (during authentication)

**Requirements:**
- Username/email and password fields
- "Remember me" checkbox (use `Checkbox`)
- Submit button with loading state
- Error notification display
- Validation using Carbon's form validation patterns
- Accessibility: ARIA labels, keyboard navigation

**API Integration:**
- POST `/api/auth/login` with `{ username, password }`
- Store JWT token in localStorage
- Redirect to dashboard on success

### ProtectedRoute.tsx

**Requirements:**
- Higher-order component to protect routes
- Check for valid JWT token
- Redirect to login if unauthenticated
- Show loading spinner while checking auth status (use `Loading`)

---

## 📊 Dashboard Page

### DashboardPage.tsx

**Carbon Components to Use:**
- `Grid`, `Column` for layout
- `Tile`, `ClickableTile` for metric cards
- `DataTable` (compact) for recent items
- `Link` for navigation
- `Tag` for status indicators

**Content:**
1. **Metrics Row** (4 tiles):
   - Total Cases (with trend indicator using `ArrowUp`/`ArrowDown` icons)
   - Open Tasks
   - Cases Assigned to Me
   - Cases Due Today

2. **Recent Cases Table**:
   - Use `DataTable` with columns: Case Number, Title, Status, Priority, Assigned To, Due Date
   - Click row to navigate to case detail
   - Use `Tag` component for status (color-coded)

3. **My Tasks Section**:
   - List of tasks assigned to current user
   - Use `StructuredListWrapper` with `StructuredListRow`
   - Show task title, case reference, due date
   - Action button to complete task

**Carbon Patterns:**
- Follow Carbon's dashboard layout patterns
- Use proper spacing tokens (spacing05, spacing06)
- Responsive grid (collapse to single column on mobile)

---

## 🗂️ Case Management Components

### CaseList.tsx / CaseDataTable.tsx

**Carbon Components to Use:**
- `DataTable` with:
  - `TableToolbar` with `TableToolbarContent`, `TableToolbarSearch`
  - `TableSelectAll`, `TableSelectRow` for batch actions
  - `TableBatchActions` for bulk operations (assign, close, delete)
  - `Pagination` at bottom
  - `DataTableSkeleton` while loading
  - `OverflowMenu` in each row for actions (view, edit, delete)

**Columns:**
1. Select checkbox
2. Case Number (sortable, clickable link)
3. Title (sortable)
4. Status (use `Tag` - green for "Resolved", blue for "In Progress", gray for "New")
5. Priority (use `Tag` - red for "High", blue for "Medium", green for "Low")
6. Assigned To (user name)
7. Due Date (sortable, formatted)
8. Actions (OverflowMenu)

**Toolbar Features:**
- Search by case number or title
- Create Case button (primary button)
- Batch actions: Assign, Change Status, Delete

**Sorting & Pagination:**
- Use Carbon's built-in `DataTable` sorting
- Server-side pagination with page size selector (10, 25, 50, 100)

**API Integration:**
- GET `/api/cases?status={status}&assignedTo={userId}&page={page}&size={size}`

### CaseDetail.tsx

**Carbon Components to Use:**
- `Breadcrumb` at top
- `Tabs` for different sections:
  - Overview
  - Tasks
  - History (audit log)
  - Comments (future)
- `Grid` and `Column` for layout
- `ContentSwitcher` for toggling views
- `Button` (ghost, primary, danger)
- `Modal` for confirmations
- `InlineLoading` for async operations

**Overview Tab Content:**

**Header Section:**
- Case number (large heading using Carbon typography)
- Status badge (use `Tag`)
- Priority badge
- Edit and Delete buttons (use `Button` with icons from `@carbon/icons-react`)

**Details Section** (2-column layout):
- Left column:
  - Title (use `TextInput` in edit mode, plain text in view mode)
  - Description (use `TextArea` in edit mode)
  - Case Type (use `Dropdown`)
  - Priority (use `RadioButtonGroup`)
- Right column:
  - Status (use `Dropdown` with available transitions from workflow)
  - Assigned To (use `ComboBox` with user search)
  - Due Date (use `DatePicker`)
  - Created/Updated timestamps (read-only)

**Custom Fields Section:**
- Render dynamically based on case type
- Use appropriate Carbon components based on field type:
  - Text: `TextInput`
  - Textarea: `TextArea`
  - Number: `NumberInput`
  - Date: `DatePicker`
  - Dropdown: `Dropdown`
  - Multi-select: `MultiSelect`
  - Boolean: `Toggle` or `Checkbox`

**Tasks Tab:**
- Embed `TaskList` component filtered by case ID
- Show task count in tab label (use `TabListTabLabel`)
- Add Task button at top

**History Tab:**
- Embed `AuditLogTable` component filtered by case ID
- Timeline view using `ProgressIndicator` or custom timeline
- Show who made changes and when

**API Integration:**
- GET `/api/cases/{id}`
- PUT `/api/cases/{id}` for updates
- DELETE `/api/cases/{id}`

### CaseForm.tsx

**Carbon Components to Use:**
- `Form` wrapper
- `TextInput` for title and case number
- `TextArea` for description
- `Dropdown` for case type, status, priority
- `ComboBox` for assigned user selection
- `DatePicker` for due date
- `Button` (primary for save, ghost for cancel)
- `InlineNotification` for validation errors
- `FormLabel`, `FormGroup`

**Modes:**
- Create mode (all fields editable)
- Edit mode (case number read-only)

**Validation:**
- Required field validation
- Due date must be in future
- Show inline errors using Carbon's form error states
- Disable submit button while validating

**Custom Fields Rendering:**
- Fetch form schema for case type
- Render fields dynamically using form schema
- Use `FormRenderer` component

**API Integration:**
- POST `/api/cases` for creation
- PUT `/api/cases/{id}` for update

### CaseStatusBadge.tsx

**Carbon Components to Use:**
- `Tag` with appropriate color based on status

**Status Color Mapping:**
- NEW: `gray` (default)
- IN_PROGRESS: `blue`
- PENDING: `purple`
- RESOLVED: `green`
- CLOSED: `gray` (high-contrast)
- CANCELLED: `red`

### CaseWorkflowPanel.tsx

**Carbon Components to Use:**
- `Tile` or `ExpandableTile`
- `Button` for transition actions
- `ProgressIndicator` to show current position in workflow
- `Modal` for transition confirmation (with notes field using `TextArea`)
- `InlineNotification` for transition errors

**Content:**
- Current state display (large, prominent)
- Visual workflow representation using `ProgressIndicator`:
  - Show all states
  - Highlight current state
  - Mark completed states
- Available transitions as action buttons
- Transition history (last 5 transitions)

**API Integration:**
- GET `/api/workflows/{workflowId}` to fetch workflow definition
- POST `/api/cases/{id}/transition?targetState={state}` to trigger transition

---

## ✅ Task Management Components

### TaskList.tsx

**Carbon Components to Use:**
- `DataTable` (simplified version) or `StructuredList`
- `Accordion` for grouping tasks by status
- `Tag` for status and priority
- `Checkbox` for task completion
- `OverflowMenu` for actions

**Layout Options:**
1. **Table View** (default):
   - Similar to CaseDataTable but simpler
   - Columns: Select, Title, Case Link, Status, Priority, Assigned To, Due Date, Actions

2. **Card View** (toggle with `ContentSwitcher`):
   - Use `TaskCard` components in grid layout
   - Better for mobile

**Filtering:**
- Status filter (Open, In Progress, Completed)
- Assigned to me checkbox
- Case filter (dropdown or combo box)
- Date range for due date

**API Integration:**
- GET `/api/tasks?caseId={caseId}&assignedTo={userId}&status={status}`

### TaskCard.tsx

**Carbon Components to Use:**
- `Tile` or `ClickableTile`
- `Tag` for status and priority
- `OverflowMenu` for actions
- `Button` (ghost) for quick complete
- Carbon icons: `Task`, `Calendar`, `User`

**Content:**
- Task title (heading)
- Case reference (link to case detail)
- Status and priority tags
- Assigned user
- Due date with urgency indicator (overdue = red text)
- Description preview (first 100 chars)
- Action buttons: View Details, Complete

**Styling:**
- Use Carbon spacing tokens
- Hover state with subtle shadow
- Overdue tasks: use border color or background tint

### TaskForm.tsx

**Carbon Components to Use:**
- `Modal` (size: large) or separate page
- `Form` wrapper
- `TextInput` for title
- `TextArea` for description
- `ComboBox` for case selection
- `Dropdown` for status, priority, task type
- `ComboBox` for assignee selection
- `DatePicker` for due date
- `Button` (primary, ghost)

**Form Schema Integration:**
- If task has a form schema (from taskType), render form fields
- Use `FormRenderer` component to render JSON Schema form
- Validate form data before submission

**API Integration:**
- POST `/api/tasks` for creation
- PUT `/api/tasks/{id}` for update

### TaskCompletionModal.tsx

**Carbon Components to Use:**
- `ComposedModal` with `ModalHeader`, `ModalBody`, `ModalFooter`
- `TextArea` for completion notes
- `FileUploader` for attachments (if needed)
- `Button` (primary for complete, ghost for cancel)
- `InlineNotification` for errors

**Content:**
- Task summary (title, case ref)
- Completion notes field (optional or required based on config)
- Form data input if task has associated form
- Completion date (auto-filled, editable)

**API Integration:**
- POST `/api/tasks/{id}/complete` with optional form data

### TaskFilters.tsx

**Carbon Components to Use:**
- `FilterPanel` (if available) or custom panel using `Tile`
- `Dropdown` for status
- `Dropdown` for priority
- `Checkbox` for "Assigned to me"
- `DatePicker` (range) for due date
- `ComboBox` for case selection
- `Button` (ghost) to reset filters

**Apply Filters:**
- Update URL query params
- Trigger re-fetch of task list

---

## 📝 Form Management Components

### FormBuilder.tsx

**Carbon Components to Use:**
- Complex component for creating JSON Schema forms
- **Left Panel** (Form Schema Editor):
  - `CodeSnippet` or `CodeMirror` integration for JSON editing
  - `Button` to add field
  - `Accordion` with form field types:
    - Text Input
    - Text Area
    - Number
    - Date
    - Dropdown
    - Multi-select
    - Checkbox
    - Radio Group
- **Center Panel** (Live Preview):
  - Use `FormRenderer` to show live preview
  - Update preview as schema changes
- **Right Panel** (Field Properties):
  - When field selected, show properties:
    - Field name (use `TextInput`)
    - Label (use `TextInput`)
    - Type (use `Dropdown`)
    - Required (use `Toggle`)
    - Default value
    - Validation rules

**Save Actions:**
- Save as draft (use `Button` ghost)
- Publish (use `Button` primary)
- Version history (use `OverflowMenu` with version list)

**API Integration:**
- POST `/api/forms` to create schema
- PUT `/api/forms/{id}` to update

### FormRenderer.tsx

**Carbon Components to Use:**
- Dynamically render form based on JSON Schema
- Map JSON Schema field types to Carbon components:
  - `string` → `TextInput`
  - `string` with `format: textarea` → `TextArea`
  - `number` / `integer` → `NumberInput`
  - `string` with `format: date` → `DatePicker`
  - `enum` → `Dropdown` or `RadioButtonGroup`
  - `array` with `enum` → `MultiSelect`
  - `boolean` → `Toggle` or `Checkbox`
- Handle validation:
  - `required` fields
  - `minLength`, `maxLength`
  - `minimum`, `maximum`
  - `pattern` (regex)
  - Custom validators

**Validation Display:**
- Use Carbon's form error states
- Show inline errors below each field
- Summary of errors at top (use `InlineNotification`)

**API Integration:**
- POST `/api/forms/{id}/validate` to validate form data server-side

### FormSchemaEditor.tsx

**Carbon Components to Use:**
- `DataTable` showing all form schemas
- Columns: Name, Code, Version, Active, Created Date, Actions
- `TableToolbar` with search and create button
- `OverflowMenu` for actions (edit, duplicate, view, deactivate)

**API Integration:**
- GET `/api/forms` to list schemas
- GET `/api/forms/code/{code}` to fetch specific schema

### FormValidationDisplay.tsx

**Carbon Components to Use:**
- `InlineNotification` (error severity) for validation errors
- `UnorderedList` to list all errors
- Link errors to specific fields (scroll to field on click)

---

## 🔄 Workflow Components

### WorkflowDiagram.tsx

**Carbon Components to Use:**
- Custom SVG or Canvas-based diagram
- Use Carbon colors and tokens for styling
- `Tile` wrapper for diagram container
- `Button` (ghost) for zoom controls
- `OverflowMenu` for diagram actions (export, full screen)

**Diagram Elements:**
- States as rounded rectangles
- Transitions as arrows between states
- Current state highlighted (use Carbon blue)
- Completed states in muted color
- Guards shown as conditions on arrows

**Interactivity:**
- Click state to see details
- Hover over transition to see guard rules
- Zoom and pan controls

**Libraries:**
- Consider: ReactFlow, D3.js, or custom SVG
- Style with Carbon design tokens

### StateTransitionButton.tsx

**Carbon Components to Use:**
- `Button` (primary or ghost based on context)
- `Modal` for confirmation with transition notes
- `Loading` button state during transition

**Props:**
- `fromState`: current state
- `toState`: target state
- `onTransition`: callback function
- `requiresConfirmation`: boolean
- `requiresNotes`: boolean

### AvailableTransitions.tsx

**Carbon Components to Use:**
- `Tile` or section within case detail
- `Button` for each available transition
- `Tag` to show guard status (enabled/disabled)
- `Tooltip` to explain why transition is disabled

**Content:**
- List of available transitions from current state
- Show guard rules for each transition
- Indicate if guards are satisfied (green check icon) or not (red X icon)
- Disable button if guards not satisfied

---

## 📜 Audit Components

### AuditLogTable.tsx

**Carbon Components to Use:**
- `DataTable` with:
  - Columns: Timestamp, User, Action, Entity Type, Entity ID, Changes
  - `TableExpandRow` for details
  - `Tag` for action type (CREATE = green, UPDATE = blue, DELETE = red)
- `DatePicker` (range) in toolbar for filtering by date
- `Dropdown` for filtering by action type
- `Dropdown` for filtering by entity type

**Expandable Row Content:**
- Show old values and new values side-by-side
- Use `CodeSnippet` for JSON data
- Highlight changed fields

**API Integration:**
- GET `/api/audit?entityType={type}&entityId={id}&userId={userId}`

### AuditLogDetail.tsx

**Carbon Components to Use:**
- `Modal` or side panel showing audit log details
- `StructuredList` for displaying changes
- `CodeSnippet` for JSON diffs
- `Tag` for action type

---

## 🧩 Layout Components

### AppHeader.tsx

**Carbon Components to Use:**
- `Header` from Carbon
- `HeaderName` with app name "Riverrun"
- `HeaderNavigation` with `HeaderMenuItem` for:
  - Dashboard
  - Cases
  - Tasks
  - Forms (admin only)
  - Workflows (admin only)
- `HeaderGlobalBar` with:
  - `HeaderGlobalAction` for notifications (use `Notification` icon)
  - `HeaderGlobalAction` for user menu (use `UserAvatar` icon)
    - Dropdown with: Profile, Settings, Logout
  - Theme switcher (light/dark mode toggle)

**User Menu:**
- Show username
- Show current tenant (if multi-tenant enabled)
- Profile link
- Settings link
- Logout button

### AppSidebar.tsx

**Carbon Components to Use:**
- `SideNav` from Carbon
- `SideNavItems` with `SideNavLink` for each menu item
- `SideNavMenu` for expandable sections
- Icons from `@carbon/icons-react`:
  - `Dashboard` for Dashboard
  - `Document` for Cases
  - `TaskView` for Tasks
  - `Form` for Forms
  - `Flow` for Workflows
  - `Report` for Audit
  - `Settings` for Settings

**Responsive:**
- Collapsible on mobile (hamburger menu in header)
- Use `SideNavProps.isRail` for icon-only mode

### AppShell.tsx

**Carbon Components to Use:**
- `Content` wrapper for main content area
- `Grid` and `Column` for responsive layout
- Combine `AppHeader` and `AppSidebar`

**Layout:**
```
┌─────────────────────────────────────┐
│         AppHeader                   │
├──────┬──────────────────────────────┤
│      │                              │
│ Side │        Main Content          │
│ Nav  │        (page content)        │
│      │                              │
└──────┴──────────────────────────────┘
```

### Breadcrumbs.tsx

**Carbon Components to Use:**
- `Breadcrumb` with `BreadcrumbItem`
- `OverflowMenu` if breadcrumb trail is long

**Examples:**
- `Home > Cases`
- `Home > Cases > CASE-12345`
- `Home > Cases > CASE-12345 > Task-789`

---

## 🛠️ Common Components

### LoadingState.tsx

**Carbon Components to Use:**
- `Loading` (default)
- `DataTableSkeleton` for table loading states
- `SkeletonPlaceholder` and `SkeletonText` for custom skeletons

**Variants:**
- Full page loading (centered spinner)
- Inline loading (small spinner)
- Skeleton loading (for lists and tables)

### ErrorBoundary.tsx

**Carbon Components to Use:**
- `InlineNotification` (error severity)
- `Button` to retry or go back

**Error Display:**
- Show friendly error message
- Show technical details in expandable section (use `Accordion`)
- Log error to console

### EmptyState.tsx

**Carbon Components to Use:**
- `Tile` wrapper
- Illustration or icon (large size from `@carbon/icons-react`)
- Heading and description text
- `Button` (primary) for action (e.g., "Create First Case")

**Use Cases:**
- No cases found
- No tasks assigned
- No search results
- Empty dashboard

### ConfirmationModal.tsx

**Carbon Components to Use:**
- `ComposedModal` with `ModalHeader`, `ModalBody`, `ModalFooter`
- `Button` (danger for destructive actions, primary for confirmations)

**Props:**
- `title`: string
- `message`: string
- `confirmText`: string (default "Confirm")
- `cancelText`: string (default "Cancel")
- `onConfirm`: callback
- `onCancel`: callback
- `danger`: boolean (use danger button style)

### PageHeader.tsx

**Carbon Components to Use:**
- `Grid` and `Column` for layout
- Large heading (use Carbon typography: `heading05` or `heading06`)
- Subtitle/description text
- Action buttons in header (aligned right)
- Optional tabs (use `Tabs` from Carbon)

**Example:**
```
┌────────────────────────────────────────┐
│  Cases Management           [+ Create] │
│  Manage and track all cases            │
├────────────────────────────────────────┤
│  All | Open | Closed | Archived        │
└────────────────────────────────────────┘
```

---

## 📱 Responsive Design Requirements

**Breakpoints** (use Carbon grid breakpoints):
- Small (sm): < 672px
- Medium (md): 672px - 1056px
- Large (lg): 1056px - 1312px
- X-Large (xlg): 1312px - 1584px
- Max (max): ≥ 1584px

**Mobile Optimizations:**
- Sidebar collapses to hamburger menu
- DataTables switch to card view or simplified mobile table
- Forms stack vertically
- Reduce padding/spacing on mobile
- Touch-friendly button sizes (minimum 44x44px)

---

## 🎭 Theming

### carbon-theme.scss

**Requirements:**
- Import Carbon themes
- Set up theme switcher
- Support light and dark modes
- Persist theme choice in localStorage

**Theme Toggle Component:**
- Use `Toggle` or `ContentSwitcher`
- Icon: `Light` and `Asleep` from Carbon icons
- Place in header global bar

**Implementation:**
```scss
@use '@carbon/react';

// Light theme (default)
@include react.theme(react.$white);

// Dark theme
[data-carbon-theme="g90"] {
  @include react.theme(react.$g90);
}
```

---

## 🔌 API Integration

### api.ts

**Setup Axios Instance:**
- Base URL from environment variable
- Request interceptor to add JWT token
- Response interceptor for error handling
- Tenant ID header injection

**Example:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Files

**Each service should export:**
- CRUD functions (create, read, update, delete)
- Custom operations (e.g., `completeTask`, `transitionCase`)
- Type-safe interfaces for requests/responses

**Example (case.service.ts):**
```typescript
import api from './api';
import { Case, CaseRequest, CaseResponse } from '../types/case.types';

export const caseService = {
  getAll: (params?: any) => api.get<CaseResponse[]>('/cases', { params }),
  getById: (id: string) => api.get<CaseResponse>(`/cases/${id}`),
  create: (data: CaseRequest) => api.post<CaseResponse>('/cases', data),
  update: (id: string, data: Partial<CaseRequest>) =>
    api.put<CaseResponse>(`/cases/${id}`, data),
  delete: (id: string) => api.delete(`/cases/${id}`),
  transition: (id: string, targetState: string) =>
    api.post<CaseResponse>(`/cases/${id}/transition`, null, {
      params: { targetState }
    }),
};
```

---

## 🧪 Testing Requirements

**Use:**
- React Testing Library
- Jest
- Carbon test utilities

**Test Coverage:**
- Unit tests for all components (>80% coverage)
- Integration tests for complex workflows
- Accessibility tests (a11y)

**Example Test:**
```typescript
import { render, screen } from '@testing-library/react';
import { CaseStatusBadge } from './CaseStatusBadge';

test('renders status badge with correct color', () => {
  render(<CaseStatusBadge status="IN_PROGRESS" />);
  const badge = screen.getByText('In Progress');
  expect(badge).toHaveClass('cds--tag--blue');
});
```

---

## ♿ Accessibility Requirements

**Carbon provides built-in accessibility, but ensure:**

1. **Semantic HTML**: Use proper heading hierarchy
2. **Keyboard Navigation**: All interactive elements accessible via keyboard
3. **ARIA Labels**: Add labels for icon-only buttons
4. **Focus Management**: Manage focus in modals and route changes
5. **Color Contrast**: Follow WCAG AA standards (Carbon themes do this by default)
6. **Screen Reader Support**: Test with screen readers (NVDA, JAWS)
7. **Alternative Text**: Provide alt text for images and icons

**Testing:**
- Use axe DevTools
- Test keyboard navigation
- Test with screen reader

---

## 🚀 Performance Optimizations

1. **Code Splitting**: Use React.lazy() for route-based code splitting
2. **Memoization**: Use React.memo(), useMemo(), useCallback() appropriately
3. **Virtual Scrolling**: For long lists (use `react-window` with Carbon)
4. **Debouncing**: Debounce search inputs (use `lodash.debounce`)
5. **Image Optimization**: Lazy load images, use appropriate formats
6. **Bundle Size**: Monitor bundle size, tree-shake unused Carbon components

---

## 📦 Dependencies

**Required Packages:**
```json
{
  "dependencies": {
    "@carbon/react": "^1.40.0",
    "@carbon/icons-react": "^11.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.5",
    "@tanstack/react-query": "^5.17.9",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@carbon/test-utils": "^1.0.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "sass": "^1.69.5"
  }
}
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation
- [X] Set up Carbon Design System
- [X] Implement authentication (login, protected routes)
- [X] Create app shell (header, sidebar, layout)
- [X] Set up routing
- [X] Configure API client

### Phase 2: Core Features
- [X] Dashboard with metrics and recent items
- [ ] Case list with DataTable, search, filters, pagination
- [ ] Case detail page with tabs (overview, tasks, history)
- [ ] Case form (create/edit)
- [ ] Task list with card/table views
- [ ] Task form and completion modal

### Phase 3: Advanced Features
- [ ] Form builder for JSON Schema forms
- [ ] Form renderer with validation
- [ ] Workflow visualization
- [ ] State transition UI
- [ ] Audit log table and detail

### Phase 4: Polish
- [ ] Loading states and skeletons
- [ ] Error handling and boundaries
- [ ] Empty states
- [ ] Responsive design refinements
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Unit and integration tests

---

## 🎯 Carbon-Specific Best Practices

1. **Use Carbon Tokens**: Never hardcode colors, spacing, or typography
2. **Follow Carbon Patterns**: Reference Carbon's pattern library for common UX patterns
3. **Component Composition**: Build complex UIs by composing Carbon primitives
4. **Consistent Spacing**: Use spacing scale (spacing02 through spacing12)
5. **Typography Scale**: Use heading01-07 and body01-02 classes
6. **Icon Size**: Use 16px or 20px sizes (Carbon standard)
7. **Button Hierarchy**: Primary for main actions, ghost for secondary, danger for destructive
8. **Form Validation**: Show errors inline below fields, not in tooltips
9. **Notification Patterns**: Use inline notifications for contextual errors, toast for global messages
10. **Loading Indicators**: Use Carbon Loading component, not custom spinners

---

## 📚 Resources

**Carbon Design System:**
- Components: https://react.carbondesignsystem.com/
- Patterns: https://carbondesignsystem.com/patterns/overview/
- Icons: https://carbondesignsystem.com/guidelines/icons/library/
- Theming: https://carbondesignsystem.com/guidelines/themes/overview/

**React Best Practices:**
- React Query: https://tanstack.com/query/latest
- React Router: https://reactrouter.com/

**TypeScript:**
- Ensure all components are fully typed
- Define interfaces for all props, API responses, and state

---

## ✅ Definition of Done

A component is considered complete when it:

1. ✅ Uses Carbon components exclusively (no custom styled components unless necessary)
2. ✅ Follows Carbon design patterns and guidelines
3. ✅ Is fully responsive (mobile, tablet, desktop)
4. ✅ Passes accessibility audit (no critical a11y issues)
5. ✅ Has proper loading and error states
6. ✅ Is fully typed with TypeScript
7. ✅ Has unit tests with >80% coverage
8. ✅ Integrates correctly with backend API
9. ✅ Handles edge cases gracefully
10. ✅ Is performant (no unnecessary re-renders, proper memoization)

---

## 🤝 Backend API Reference

**All API endpoints are documented in the backend. Key endpoints:**

**Authentication:**
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validate token

**Cases:**
- `GET /api/cases` - List cases (with filters)
- `GET /api/cases/{id}` - Get case detail
- `POST /api/cases` - Create case
- `PUT /api/cases/{id}` - Update case
- `DELETE /api/cases/{id}` - Delete case
- `POST /api/cases/{id}/transition?targetState={state}` - Transition state

**Tasks:**
- `GET /api/tasks` - List tasks (with filters)
- `GET /api/tasks/{id}` - Get task detail
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `POST /api/tasks/{id}/complete` - Complete task
- `DELETE /api/tasks/{id}` - Delete task

**Forms:**
- `GET /api/forms` - List form schemas
- `GET /api/forms/{id}` - Get form schema
- `GET /api/forms/code/{code}` - Get form by code
- `POST /api/forms` - Create form schema
- `PUT /api/forms/{id}` - Update form schema
- `POST /api/forms/{id}/validate` - Validate form data

**Workflows:**
- (Coming soon - workflow definition management)

**Audit:**
- (Coming soon - audit log API)

**All requests require `Authorization: Bearer {token}` header.**
**Multi-tenant setups require `X-Tenant-ID` header.**

---

This document provides comprehensive guidance for building the Riverrun frontend using IBM Carbon Design System. Follow Carbon's guidelines strictly to ensure consistency, accessibility, and adherence to design best practices.
