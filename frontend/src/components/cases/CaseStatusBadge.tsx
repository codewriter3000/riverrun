import React from "react";
import { Tag } from "@carbon/react";

export type CaseStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "PENDING"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED"
  | string;

const statusMap: Record<string, { label: string; type: string }> = {
  NEW: { label: "New", type: "gray" },
  IN_PROGRESS: { label: "In Progress", type: "blue" },
  PENDING: { label: "Pending", type: "purple" },
  RESOLVED: { label: "Resolved", type: "green" },
  CLOSED: { label: "Closed", type: "gray" },
  CANCELLED: { label: "Cancelled", type: "red" },
};

interface CaseStatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({ status, className }) => {
  const normalized = status?.toUpperCase() || "";
  const { label, type } = statusMap[normalized] || { label: status, type: "gray" };
  return (
    <Tag type={type} className={className}>
      {label}
    </Tag>
  );
};

export default CaseStatusBadge;
