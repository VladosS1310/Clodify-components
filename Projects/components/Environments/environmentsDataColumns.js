export const columns = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'Project #',
    accessor: 'project_id',
  },
  {
    Header: 'Project name',
    accessor: 'project_name',
  },
  {
    Header: 'Branch',
    accessor: 'branch',
  },
  {
    Header: 'Access roles',
    accessor: 'access_roles',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    disableGlobalFilter: true,
  },
];
