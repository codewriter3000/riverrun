import { useParams } from "react-router-dom";
import { useState } from 'react';
import {
  Breadcrumb, BreadcrumbItem, Tabs, Tab, TabList, TabPanel, TabPanels,
  Tag, Button, Grid, Column, TextInput, TextArea, Dropdown, RadioButtonGroup, RadioButton,
  ComboBox, DatePicker, DatePickerInput
} from "@carbon/react";
import { Edit, TrashCan } from "@carbon/icons-react";
import TaskList from "../components/fragments/TaskList";
import AuditLogTable from "../components/fragments/AuditLogTable";

export const CaseDetails: React.FC = () => {
  const params = useParams();
  const caseId = params.id;

  // Mock data for demonstration
  const caseData = {
    id: caseId,
    title: "Sample Case Title",
    description: "This is a sample case description.",
    status: "New",
    priority: "High",
    type: "Legal",
    assignedTo: "Karen Phillips",
    dueDate: "2025-12-30",
    createdAt: "2025-11-01 10:00",
    updatedAt: "2025-11-10 15:30",
  };

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: caseData.title,
    description: caseData.description,
    type: caseData.type,
    priority: caseData.priority,
    status: caseData.status,
    assignedTo: caseData.assignedTo,
    dueDate: caseData.dueDate,
  });

  const caseTitle = (() => {
    switch (caseId) {
      case "180145": return "Insurance Claim";
      case "180146": return "Contract Dispute";
      case "180147": return "Property Settlement";
      case "180148": return "Personal Injury";
      case "180149": return "Employment Termination";
      case "180150": return "Intellectual Property";
      case "180151": return "Lease Agreement";
      case "180152": return "Bankruptcy Filing";
      case "180153": return "Vendor Contract Review";
      case "180154": return "Merger Documentation";
      default: return "Case Details";
    }
  })();

  // Options for dropdowns and combo box
  const typeOptions = [
    { id: "Legal", label: "Legal" },
    { id: "Financial", label: "Financial" },
    { id: "HR", label: "HR" },
  ];
  const statusOptions = [
    { id: "New", label: "New" },
    { id: "In Progress", label: "In Progress" },
    { id: "Resolved", label: "Resolved" },
  ];
  const priorityOptions = [
    { id: "High", label: "High" },
    { id: "Medium", label: "Medium" },
    { id: "Low", label: "Low" },
  ];
  const userOptions = [
    "Karen Phillips", "John Smith", "Sarah Johnson", "Michael Chen", "Emily Davis",
    "David Martinez", "Lisa Anderson", "James Wilson", "Robert Taylor"
  ];

  // Mock tasks for demonstration
  const allTasks = [
    { id: "t1", caseId: "180145", title: "Review documents", status: "Open" },
    { id: "t2", caseId: "180145", title: "Contact client", status: "In Progress" },
    { id: "t3", caseId: "180146", title: "Draft contract", status: "Open" },
    { id: "t4", caseId: "180145", title: "Schedule meeting", status: "Completed" },
  ];
  const tasks = allTasks.filter(t => t.caseId === caseId);

  // Mock audit logs for demonstration
  const allLogs = [
    { id: "a1", caseId: "180145", action: "Created case", user: "Karen Phillips", timestamp: "2025-11-01 10:00" },
    { id: "a2", caseId: "180145", action: "Updated title", user: "John Smith", timestamp: "2025-11-02 12:00" },
    { id: "a3", caseId: "180145", action: "Changed status to In Progress", user: "Sarah Johnson", timestamp: "2025-11-03 09:30" },
    { id: "a4", caseId: "180146", action: "Created case", user: "Michael Chen", timestamp: "2025-11-04 14:00" },
    { id: "a5", caseId: "180145", action: "Added comment", user: "Emily Davis", timestamp: "2025-11-05 16:45" },
  ];
  const logs = allLogs.filter(l => l.caseId === caseId);

  const getStatusTagType = (status: string) => {
    switch (status) {
      case "New": return "gray";
      case "In Progress": return "blue";
      case "Resolved": return "green";
      default: return "purple";
    }
  };
  const getPriorityTagType = (priority: string) => {
    switch (priority) {
      case "High": return "red";
      case "Medium": return "blue";
      case "Low": return "green";
      default: return "purple";
    }
  };

  // Handlers for form changes
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem href="/cases">Case List</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{caseTitle}</BreadcrumbItem>
      </Breadcrumb>
      <h1>Case Details</h1>
      <p>Case ID: {caseId}</p>
      <Tabs>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Tasks {tasks.length > 0 ? `(${tasks.length})` : ""}</Tab>
          <Tab>History</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* Overview Content */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <h2 style={{ fontSize: "2rem", margin: 0 }}>Case #{caseId}</h2>
                <Tag type={getStatusTagType(form.status)}>{form.status}</Tag>
                <Tag type={getPriorityTagType(form.priority)}>{form.priority}</Tag>
                <Button
                  kind="ghost"
                  hasIconOnly
                  iconDescription="Edit"
                  size="sm"
                  onClick={() => setEditMode((v) => !v)}
                  style={{ marginLeft: "auto" }}
                >
                  <Edit size={20} />
                </Button>
                <Button
                  kind="danger--ghost"
                  hasIconOnly
                  iconDescription="Delete"
                  size="sm"
                  style={{ marginLeft: "0.5rem" }}
                >
                  <TrashCan size={20} />
                </Button>
              </div>
            </div>
            <Grid condensed>
              <Column sm={4} md={8} lg={8}>
                {/* Title */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="case-title" style={{ fontWeight: 600 }}>Title</label>
                  {editMode ? (
                    <TextInput
                      id="case-title"
                      value={form.title}
                      onChange={e => handleChange("title", e.target.value)}
                      style={{ marginTop: 4 }}
                    />
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.title}</div>
                  )}
                </div>
                {/* Description */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="case-description" style={{ fontWeight: 600 }}>Description</label>
                  {editMode ? (
                    <TextArea
                      id="case-description"
                      value={form.description}
                      onChange={e => handleChange("description", e.target.value)}
                      style={{ marginTop: 4 }}
                    />
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.description}</div>
                  )}
                </div>
                {/* Case Type */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="case-type" style={{ fontWeight: 600 }}>Case Type</label>
                  {editMode ? (
                    <Dropdown
                      id="case-type"
                      items={typeOptions}
                      itemToString={item => item?.label ?? ""}
                      selectedItem={typeOptions.find(opt => opt.id === form.type)}
                      onChange={({ selectedItem }) => handleChange("type", selectedItem?.id)}
                      style={{ marginTop: 4 }}
                    />
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.type}</div>
                  )}
                </div>
                {/* Priority */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: 600 }}>Priority</label>
                  {editMode ? (
                    <RadioButtonGroup
                      name="priority"
                      orientation="horizontal"
                      valueSelected={form.priority}
                      onChange={val => handleChange("priority", val)}
                      style={{ marginTop: 4 }}
                    >
                      {priorityOptions.map(opt => (
                        <RadioButton key={opt.id} value={opt.id} id={`priority-${opt.id}`} labelText={opt.label} />
                      ))}
                    </RadioButtonGroup>
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.priority}</div>
                  )}
                </div>
              </Column>
              <Column sm={4} md={8} lg={8}>
                {/* Status */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="case-status" style={{ fontWeight: 600 }}>Status</label>
                  {editMode ? (
                    <Dropdown
                      id="case-status"
                      items={statusOptions}
                      itemToString={item => item?.label ?? ""}
                      selectedItem={statusOptions.find(opt => opt.id === form.status)}
                      onChange={({ selectedItem }) => handleChange("status", selectedItem?.id)}
                      style={{ marginTop: 4 }}
                    />
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.status}</div>
                  )}
                </div>
                {/* Assigned To */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="case-assigned" style={{ fontWeight: 600 }}>Assigned To</label>
                  {editMode ? (
                    <ComboBox
                      id="case-assigned"
                      items={userOptions}
                      selectedItem={form.assignedTo}
                      onChange={({ selectedItem }) => handleChange("assignedTo", selectedItem)}
                      style={{ marginTop: 4 }}
                    />
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.assignedTo}</div>
                  )}
                </div>
                {/* Due Date */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="case-due-date" style={{ fontWeight: 600 }}>Due Date</label>
                  {editMode ? (
                    <DatePicker
                      datePickerType="single"
                      value={form.dueDate}
                      onChange={dates => handleChange("dueDate", dates[0])}
                    >
                      <DatePickerInput
                        id="case-due-date"
                        labelText=""
                        value={form.dueDate}
                        style={{ marginTop: 4 }}
                      />
                    </DatePicker>
                  ) : (
                    <div style={{ marginTop: 4 }}>{form.dueDate}</div>
                  )}
                </div>
                {/* Created/Updated */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: 600 }}>Created</label>
                  <div style={{ marginTop: 4 }}>{caseData.createdAt}</div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: 600 }}>Updated</label>
                  <div style={{ marginTop: 4 }}>{caseData.updatedAt}</div>
                </div>
              </Column>
            </Grid>
          </TabPanel>
          <TabPanel>
            <TaskList caseId={caseId} tasks={tasks} />
          </TabPanel>
          <TabPanel>
            <AuditLogTable caseId={caseId} logs={logs} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* Add more case details here */}
    </div>
  );
};
