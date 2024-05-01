export const columns = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'Milestone',
    accessor: 'name',
  },
  {
    Header: 'Start Date',
    accessor: 'start_date',
  },
  {
    Header: 'End Date',
    accessor: 'end_date',
  },
  {
    Header: 'Estimate',
    accessor: 'estimated_amount',
  },
  {
    Header: 'Closed Date',
    accessor: 'closed_date',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    disableGlobalFilter: true,
  },
];