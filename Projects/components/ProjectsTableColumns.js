export const columns = [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Jira',
    accessor: 'jira',
  },
  {
    Header: 'Logged Hours',
    accessor: 'total_logged',
  },
  {
    Header: 'Paid Hours',
    accessor: 'total_paid',
  },
  {
    Header: 'Approved Hours',
    accessor: 'total_approved',
  },
  {
    Header: 'Cost',
    accessor: 'cost',
  },
  {
    Header: 'Date Start',
    accessor: 'date_start',
  },
  {
    Header: 'Date End',
    accessor: 'date_end',
  },
  {
    Header: 'Developers',
    accessor: 'developers',
  },
  {
    Header: 'Clients',
    accessor: 'clients',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    disableGlobalFilter: true,
  }
];