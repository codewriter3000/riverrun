import {
  Grid,
  Column,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@carbon/react";

export const DashboardPage: React.FC = () => {
  const myTasksRows = [
    {
      id: "14876",
      title: "Process claim",
      status: "Complete",
      priority: "Medium",
      dueDate: "12/30/25",
    },
    {
      id: "14877",
      title: "Review contract terms",
      status: "In Progress",
      priority: "High",
      dueDate: "12/29/25",
    },
    {
      id: "14878",
      title: "Update client records",
      status: "Pending",
      priority: "Low",
      dueDate: "01/02/26",
    },
    {
      id: "14879",
      title: "Prepare court documents",
      status: "In Progress",
      priority: "High",
      dueDate: "12/31/25",
    },
    {
      id: "14880",
      title: "Schedule deposition",
      status: "Pending",
      priority: "Medium",
      dueDate: "01/05/26",
    },
  ];

  const myTasksHeaders = [
    {
      key: "id",
      header: "Task #",
    },
    {
      key: "title",
      header: "Title",
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
      key: "dueDate",
      header: "Due Date",
    },
  ];

  const recentCasesRows = [
    {
      id: "180145",
      title: "Insurance Claim",
      status: "Pending",
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
      status: "Closed",
      priority: "Low",
      assignedTo: "Sarah Johnson",
      dueDate: "12/15/25",
    },
    {
      id: "180148",
      title: "Personal Injury",
      status: "Pending",
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
      status: "Pending",
      priority: "High",
      assignedTo: "Karen Phillips",
      dueDate: "12/28/25",
    },
    {
      id: "180151",
      title: "Lease Agreement",
      status: "Closed",
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
      status: "Pending",
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
    },
    {
      key: "title",
      header: "Title",
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
  ];

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <Grid style={{ marginTop: 12 }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            Total Cases
            <br />
            <br />
            146
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            Open Tasks
            <br />
            <br />3
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            Assigned to Me
            <br />
            <br />1
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            Due Today
            <br />
            <br />0
          </Tile>
        </Column>
      </Grid>
      <div style={{ marginBottom: 20 }} />
      <Tabs>
        <TabList aria-label="Dashboard tabs" scrollDebounceWait={200}>
          <Tab>My Tasks</Tab>
          <Tab>Recent Cases</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableContainer
              title="My Tasks"
              description="View tasks that are assigned to you"
            >
              <DataTable rows={myTasksRows} headers={myTasksHeaders}>
                {({
                  rows,
                  headers,
                  getTableProps,
                  getHeaderProps,
                  getRowProps,
                  getCellProps,
                }) => (
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow {...getRowProps({ row })}>
                          {row.cells.map((cell) => (
                            <TableCell {...getCellProps({ cell })}>
                              {cell.value}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </DataTable>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer
              title="Recent Cases"
              description="View cases that were recently opened"
            >
              <DataTable rows={recentCasesRows} headers={recentCasesHeaders}>
                {({
                  rows,
                  headers,
                  getTableProps,
                  getHeaderProps,
                  getRowProps,
                  getCellProps,
                }) => (
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow {...getRowProps({ row })}>
                          {row.cells.map((cell) => (
                            <TableCell {...getCellProps({ cell })}>
                              {cell.value}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </DataTable>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
