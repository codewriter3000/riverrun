import React from "react";
import {
  TableContainer,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  Button,
} from "@carbon/react";

type Task = {
  id: string;
  caseId: string;
  title: string;
  status: string;
};

type TaskListProps = {
  caseId: string | undefined;
  tasks: Task[];
};

const headers = [
  { key: "id", header: "Task ID" },
  { key: "title", header: "Title" },
  { key: "status", header: "Status" },
];

const TaskList: React.FC<TaskListProps> = ({ caseId, tasks }) => {
  return (
    <TableContainer title="Tasks" description={`Tasks for Case #${caseId}`}>
      <DataTable rows={tasks} headers={headers}>
        {({
          rows,
          headers,
          getTableProps,
          getHeaderProps,
          getRowProps,
        }) => (
          <>
            <TableToolbar>
              <TableToolbarContent>
                <Button kind="primary" size="lg">Add Task</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </DataTable>
    </TableContainer>
  );
};

export default TaskList;
