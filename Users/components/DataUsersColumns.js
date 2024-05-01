export const columns = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'Avatar',
    accessor: 'avatar',
    disableSortBy: true,
    Cell: () => {
      return (
        <img src={`${process.env.PUBLIC_URL}/img/user-avatar.svg`} alt="Avatar" style={{width: "100%", maxWidth: "68px"}} />
      )
    },
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Role',
    accessor: 'role',
  },
  {
    Header: 'Email/Slack',
    accessor: 'email',
  },

  {
    Header: 'Phone',
    accessor: 'phone',
  },
  {
    Header: 'Joined',
    accessor: 'joined',
    disableGlobalFilter: true,
  },
  {
    Header: 'Status',
    accessor: 'status',
    disableGlobalFilter: true,
  },
  {
    Header: 'Salary',
    accessor: 'salary',
    disableGlobalFilter: true,
  },
  {
    Header: 'Mnur',
    accessor: 'min_non_upwork_sale_rate',
    disableGlobalFilter: true,
  },
  {
    Header: 'Mur',
    accessor: 'min_upwork_sale_rate',
    disableGlobalFilter: true,
  },
  {
    Header: 'Osr',
    accessor: 'optimal_sale_rate',
    disableGlobalFilter: true,
  },
  {
    Header: 'Vacation Days',
    accessor: 'vacation_days',
    disableGlobalFilter: true,
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    disableGlobalFilter: true,
    disableSortBy: true
  },
];



