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
  ProgressIndicator,
  ProgressStep,
} from "@carbon/react";

type AuditLog = {
  id: string;
  caseId: string;
  action: string;
  user: string;
  timestamp: string;
};

type AuditLogTableProps = {
  caseId: string | undefined;
  logs: AuditLog[];
};

const headers = [
  { key: "timestamp", header: "Timestamp" },
  { key: "user", header: "User" },
  { key: "action", header: "Action" },
];

const AuditLogTable: React.FC<AuditLogTableProps> = ({ caseId, logs }) => {
  const filteredLogs = logs.filter(log => log.caseId === caseId);

  return (
    <div>
      <TableContainer title="Audit Log" description={`Audit log for Case #${caseId}`}>
        <DataTable rows={filteredLogs} headers={headers}>
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
                  {/* No actions */}
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
      <div style={{ marginTop: "2rem" }}>
        <ProgressIndicator currentIndex={filteredLogs.length - 1}>
          {filteredLogs.map((log, idx) => (
            <ProgressStep
              key={log.id}
              label={log.action}
              description={`${log.user} at ${log.timestamp}`}
              secondaryLabel={log.user}
              complete={idx < filteredLogs.length - 1}
              current={idx === filteredLogs.length - 1}
            />
          ))}
        </ProgressIndicator>
      </div>
    </div>
  );
};

export default AuditLogTable;
