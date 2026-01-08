import React, { useState } from "react";
import {
  Form,
  TextInput,
  TextArea,
  Dropdown,
  RadioButtonGroup,
  RadioButton,
  Button,
  DatePicker,
  DatePickerInput,
  ComboBox,
  InlineNotification,
  FormLabel,
  FormGroup,
} from "@carbon/react";
import { useNavigate } from "react-router-dom";

const typeOptions = [
  { id: "Legal", label: "Legal" },
  { id: "Financial", label: "Financial" },
  { id: "HR", label: "HR" },
];
const priorityOptions = [
  { id: "High", label: "High" },
  { id: "Medium", label: "Medium" },
  { id: "Low", label: "Low" },
];
const statusOptions = [
  { id: "New", label: "New" },
  { id: "In Progress", label: "In Progress" },
  { id: "Resolved", label: "Resolved" },
];
const userOptions = [
  "Karen Phillips", "John Smith", "Sarah Johnson", "Michael Chen", "Emily Davis",
  "David Martinez", "Lisa Anderson", "James Wilson", "Robert Taylor"
];

const CaseForm: React.FC<{ mode?: "create" | "edit"; initialData?: any }> = ({
  mode = "create",
  initialData = {},
}) => {
  const [form, setForm] = useState({
    caseNumber: initialData.caseNumber || "",
    title: initialData.title || "",
    description: initialData.description || "",
    type: initialData.type || "",
    priority: initialData.priority || "Medium",
    status: initialData.status || "New",
    assignedTo: initialData.assignedTo || undefined,
    dueDate: initialData.dueDate || "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation
  const validate = () => {
    const errs: string[] = [];
    if (!form.title) errs.push("Title is required.");
    if (!form.caseNumber) errs.push("Case number is required.");
    if (!form.type) errs.push("Case type is required.");
    if (!form.priority) errs.push("Priority is required.");
    if (!form.status) errs.push("Status is required.");
    if (!form.assignedTo) errs.push("Assigned To is required.");
    if (!form.dueDate) errs.push("Due date is required.");
    if (form.dueDate && new Date(form.dueDate) <= new Date()) errs.push("Due date must be in the future.");
    return errs;
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      // TODO: API call (POST or PUT depending on mode)
      // Example:
      // if (mode === "create") await api.post("/cases", form);
      // else await api.put(`/cases/${form.caseNumber}`, form);
    } catch (err) {
      setErrors(["Failed to submit."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{mode === "edit" ? "Edit Case" : "Create New Case"}</h2>
      {errors.length > 0 && (
        <InlineNotification
          kind="error"
          title="Validation Error"
          subtitle={<ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
          lowContrast
        />
      )}
      <FormGroup legendText="Case Details">
        <FormLabel htmlFor="case-number">Case Number</FormLabel>
        <TextInput
          id="case-number"
          labelText=""
          value={form.caseNumber}
          onChange={e => handleChange("caseNumber", e.target.value)}
          required
          disabled={mode === "edit"}
          invalid={!!errors.find(e => e.toLowerCase().includes("case number"))}
        />
        <FormLabel htmlFor="case-title">Title</FormLabel>
        <TextInput
          id="case-title"
          labelText=""
          value={form.title}
          onChange={e => handleChange("title", e.target.value)}
          required
          invalid={!!errors.find(e => e.toLowerCase().includes("title"))}
        />
        <FormLabel htmlFor="case-description">Description</FormLabel>
        <TextArea
          id="case-description"
          labelText=""
          value={form.description}
          onChange={e => handleChange("description", e.target.value)}
        />
        <FormLabel htmlFor="case-type">Case Type</FormLabel>
        <Dropdown
          id="case-type"
          titleText=""
          items={typeOptions}
          itemToString={item => item?.label ?? ""}
          selectedItem={typeOptions.find(opt => opt.id === form.type)}
          onChange={({ selectedItem }) => handleChange("type", selectedItem?.id)}
          required
          invalid={!!errors.find(e => e.toLowerCase().includes("type"))}
        />
        <FormLabel>Priority</FormLabel>
        <Dropdown
          id="case-priority"
          titleText=""
          items={priorityOptions}
          itemToString={item => item?.label ?? ""}
          selectedItem={priorityOptions.find(opt => opt.id === form.priority)}
          onChange={({ selectedItem }) => handleChange("priority", selectedItem?.id)}
          required
          invalid={!!errors.find(e => e.toLowerCase().includes("priority"))}
        />
        <FormLabel>Status</FormLabel>
        <Dropdown
          id="case-status"
          titleText=""
          items={statusOptions}
          itemToString={item => item?.label ?? ""}
          selectedItem={statusOptions.find(opt => opt.id === form.status)}
          onChange={({ selectedItem }) => handleChange("status", selectedItem?.id)}
          required
          invalid={!!errors.find(e => e.toLowerCase().includes("status"))}
        />
        <FormLabel>Assigned To</FormLabel>
        <ComboBox
          id="case-assigned"
          titleText=""
          items={userOptions}
          selectedItem={form.assignedTo}
          onChange={({ selectedItem }) => handleChange("assignedTo", selectedItem)}
          required
          invalid={!!errors.find(e => e.toLowerCase().includes("assigned to"))}
        />
        <FormLabel>Due Date</FormLabel>
        <DatePicker
          datePickerType="single"
          onChange={dates => handleChange("dueDate", dates[0])}
        >
          <DatePickerInput
            id="case-due-date"
            labelText=""
            value={form.dueDate}
            required
            invalid={!!errors.find(e => e.toLowerCase().includes("due date"))}
          />
        </DatePicker>
      </FormGroup>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Button type="submit" kind="primary" disabled={submitting || errors.length > 0}>
          {mode === "edit" ? "Save Changes" : "Create Case"}
        </Button>
        <Button
          kind="ghost"
          type="button"
          disabled={submitting}
          onClick={() => navigate("/cases")}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default CaseForm;
