import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TableContainer,
  DataTable,
  DataTableSkeleton,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableSelectRow,
  Button,
  Pagination,
  Tag,
  FilterableMultiSelect,
  Checkbox,
  DatePicker,
  DatePickerInput,
  Layer,
  OverflowMenu,
  TableToolbarMenu,
} from "@carbon/react";
import { Filter } from "@carbon/icons-react";
import "./_styles.scss";

type CaseListProps = {
  onDetails?: (caseId: string) => void;
};

const CaseList = ({ onDetails }: CaseListProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<any[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<any[]>([]);
  const navigate = useNavigate();

  const getStatusTagType = (status: string) => {
    switch (status) {
      case "New":
        return "gray";
      case "In Progress":
        return "blue";
      case "Resolved":
        return "green";
      default:
        return "purple";
    }
  };

  const getPriorityTagType = (priority: string) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "blue";
      case "Low":
        return "green";
      default:
        return "purple";
    }
  };

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const recentCasesRows = [
    {
      id: "180145",
      title: "Insurance Claim",
      status: "New",
      priority: "High",
      assignedTo: "Karen Phillips",
      dueDate: "12/30/25",
    },
    {
      id: "180146",
      title: "Contract Dispute",
      status: "In Progress",
      priority: "Medium",
      assignedTo: "John Smith",
      dueDate: "01/05/26",
    },
    {
      id: "180147",
      title: "Property Settlement",
      status: "Resolved",
      priority: "Low",
      assignedTo: "Sarah Johnson",
      dueDate: "12/15/25",
    },
    {
      id: "180148",
      title: "Personal Injury",
      status: "New",
      priority: "High",
      assignedTo: "Michael Chen",
      dueDate: "01/10/26",
    },
    {
      id: "180149",
      title: "Employment Termination",
      status: "In Progress",
      priority: "Medium",
      assignedTo: "Emily Davis",
      dueDate: "01/20/26",
    },
    {
      id: "180150",
      title: "Intellectual Property",
      status: "New",
      priority: "High",
      assignedTo: "Karen Phillips",
      dueDate: "12/28/25",
    },
    {
      id: "180151",
      title: "Lease Agreement",
      status: "Resolved",
      priority: "Low",
      assignedTo: "David Martinez",
      dueDate: "12/10/25",
    },
    {
      id: "180152",
      title: "Bankruptcy Filing",
      status: "In Progress",
      priority: "High",
      assignedTo: "Lisa Anderson",
      dueDate: "01/15/26",
    },
    {
      id: "180153",
      title: "Vendor Contract Review",
      status: "New",
      priority: "Medium",
      assignedTo: "James Wilson",
      dueDate: "01/08/26",
    },
    {
      id: "180154",
      title: "Merger Documentation",
      status: "In Progress",
      priority: "High",
      assignedTo: "Robert Taylor",
      dueDate: "01/25/26",
    },
  ];

  const recentCasesHeaders = [
    {
      key: "id",
      header: "Case #",
      isSortable: true,
    },
    {
      key: "title",
      header: "Title",
      isSortable: true,
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "priority",
      header: "Priority",
    },
    {
      key: "assignedTo",
      header: "Assigned To",
    },
    {
      key: "dueDate",
      header: "Due Date",
    },
    {
      key: "actions",
      header: "Actions",
    }
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

  // Apply filters
  const filteredRows = recentCasesRows.filter((row) => {
    // Status filter
    if (
      selectedStatuses.length > 0 &&
      !selectedStatuses.some((s) => s.id === row.status)
    ) {
      return false;
    }
    // Priority filter
    if (
      selectedPriorities.length > 0 &&
      !selectedPriorities.some((p) => p.id === row.priority)
    ) {
      return false;
    }
    return true;
  });

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={7}
        rowCount={5}
        headers={[
          { header: "Case #" },
          { header: "Title" },
          { header: "Status" },
          { header: "Priority" },
          { header: "Assigned To" },
          { header: "Due Date" },
          { header: "Actions" },
        ]}
        showHeader={true}
        showToolbar={true}
      />
    );
  }

  return (
    <TableContainer title="Case List" description="View all cases">
      <DataTable rows={paginatedRows} headers={recentCasesHeaders} isSortable>
        {({
          rows,
          headers,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getBatchActionProps,
          selectedRows,
        }) => {
          const batchActionProps = getBatchActionProps();

          return (
            <>
              <TableToolbar>
                <TableBatchActions {...batchActionProps}>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={() => null}
                    onClick={() => console.log("Assign clicked", selectedRows)}
                  >
                    Assign
                  </TableBatchAction>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={() => null}
                    onClick={() => console.log("Close clicked", selectedRows)}
                  >
                    Close
                  </TableBatchAction>
                  <TableBatchAction
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                    renderIcon={() => null}
                    onClick={() => console.log("Delete clicked", selectedRows)}
                  >
                    Delete
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch />
                  <Button kind="primary" onClick={() => navigate("/cases/new")}>
                    Add new
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header) => (
                      <TableHeader
                        {...getHeaderProps({ header })}
                        isSortable={header.isSortable}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === "status" ? (
                            <Tag type={getStatusTagType(cell.value)}>
                              {cell.value}
                            </Tag>
                          ) : cell.info.header === "priority" ? (
                            <Tag type={getPriorityTagType(cell.value)}>
                              {cell.value}
                            </Tag>
                          ) : cell.info.header === "actions" ? (
                            <Button
                              kind="ghost"
                              size="sm"
                              onClick={() => onDetails?.(row.id)}
                            >
                              Details
                            </Button>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={page}
                pageSize={pageSize}
                pageSizes={[5, 10, 20, 50]}
                totalItems={filteredRows.length}
                onChange={({ page, pageSize }) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
              />
            </>
          );
        }}
      </DataTable>
    </TableContainer>
  );
};

export default CaseList;
