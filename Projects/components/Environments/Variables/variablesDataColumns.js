export const columns = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Value',
    accessor: 'value',
  },
  // TODO refactor shred column when we have API data for them
  // {
  //   Header: 'Is shared',
  //   accessor: 'shared',
  //   disableGlobalFilter: true,
  // },
  {
    Header: 'Actions',
    accessor: 'actions',
    disableGlobalFilter: true,
  },
];

export const sharedColumns = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Value',
    accessor: 'value',
  },
  {
    Header: 'Shared By',
    accessor: 'shared_from_project_name',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    disableGlobalFilter: true,
  },
];
