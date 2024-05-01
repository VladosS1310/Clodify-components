import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { columns } from './components/DataUsersColumns';
import ReactTooltip from 'react-tooltip';
import DeleteIcon from 'mdi-react/DeleteIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import BriefcaseIcon from 'mdi-react/BriefcaseIcon';
import ClockTimeFourIcon from 'mdi-react/ClockTimeFourIcon';
import ArrowRightThinCircleOutlineIcon from 'mdi-react/ArrowRightThinCircleOutlineIcon';
import CurrencyUsdIcon from 'mdi-react/CurrencyUsdIcon';
import PencilBoxIcon from 'mdi-react/PencilBoxIcon';
import DataReactTable from '../../Tables/DataTable/components/DataReactTable';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersFetchingAction } from '../../../redux/actions/usersActions';
import UsersFilterForm from './components/UsersFilterForm/UsersFilterForm';
import ConfirmModal from '../../../shared/components/customComponents/CustomConfirmModal/ConfirmModal';
import { deleteUser, postDelaySalaryUser, putActivateUser, putDeactivateUser, putUserSalary } from '../../../utils/api';
import CustomModal from '../../../shared/components/customComponents/CustomModal/CustomModal';
import DelaySalaryModalForm from './components/DelaySalaryModalForm/DelaySalaryModalForm';
import { useNavigate } from 'react-router-dom';
import { loginAs } from '../../../redux/actions/authActions';
import _ from 'lodash';
import Roles from '../../../config/roles';


const TableButton = ({isActive, setActivateId, id, setActivateModal, setDeactivateId, setDeactivateModal}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMetaData = () => {
    const obj = {
      btnLabel: "",
      btnClass: ""
    }
    if(isActive) {
      obj.btnLabel = "Activated";
      obj.btnClass = "btn-activated";
    }
    if(isHovered && isActive) {
      obj.btnLabel = "Deactivate";
      obj.btnClass = "btn-deactivated";
    }

    if(!isActive) {
      obj.btnLabel = "Deactivated";
      obj.btnClass = "btn-deactivated";
    }
    if(!isActive && isHovered) {
      obj.btnLabel = "Activate";
      obj.btnClass = "btn-activated";
    }

    return obj;
  }

  const {btnLabel, btnClass} = getMetaData();

  return (
    <button
      className={btnClass}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if(!isActive) {
          setActivateId(id);
          setActivateModal(true);
        } else {
          setDeactivateId(id);
          setDeactivateModal(true);
        }
      }}
    >{btnLabel}</button>
  )
}

const InputOfficialSalary = ({value, onChange, onBlur}) => {
  return (
    <input
      type='text'
      value={value}
      style={{border: 0, outline: "1px solid gray", width: "50px", padding: "4px 4px 1px 3px" }}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}

const EditSalaryIcon = ({toggleInput }) => {
  return (
    <PencilBoxIcon className="edit-salary" onClick={toggleInput} style={{cursor: "pointer", padding: 0}} size={18} color="#b1c3c8" />
  )
}

const Users = () => {
  const { users, errors, totalRecords } = useSelector(state => state.users);
  const userRole = useSelector(state => state?.auth?.impersonatedUser?.role || state?.auth?.user.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [query, setQuery] = useState({ start: 0, limit: 10, search_query: '', role: '', is_active: null });
  const [deleteId, setDeleteId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [failedDeleteModal, setFailedDeleteModal] = useState(false);
  const [successDeletedModal, setSuccessDeletedModal] = useState(false);
  const [activateId, setActivateId] = useState(null);
  const [activateModal, setActivateModal] = useState(false);
  const [messageActivateError, setMessageActivateError] = useState('');
  const [failedActivateModal, setFailedActivateModal] = useState(false);
  const [successActivateModal, setSuccessActivateModal] = useState(false);
  const [deactivateId, setDeactivateId] = useState(null);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [messageDeactivateError, setMessageDeactivateError] = useState('');
  const [failedDeactivateModal, setFailedDeactivateModal] = useState(false);
  const [successDeactivateModal, setSuccessDeactivateModal] = useState(false);
  const [delaySalaryModal, setDelaySalaryModal] = useState(false);
  const [delaySalaryId, setDelaySalaryId] = useState(null);
  const [salaryUser, setSalaryUser] = useState(null);
  const [salaryNameUser, setSalaryUserName] = useState('');
  const [messageDelaySalaryError, setMessageDelaySalaryError] = useState('');
  const [failedDelaySalaryModal, setFailedDelaySalaryModal] = useState(false);
  const [successDelaySalaryModal, setSuccessDelaySalaryModal] = useState(false);
  const [toggleInputSalary, setToggleInputSalary] = useState({});
  const [messageChangeSalaryError, setMessageChangeSalaryError] = useState('');
  const [failedChangeSalaryModal, setFailedChangeSalaryModal] = useState(false);
  const [successChangeSalaryModal, setSuccessChangeSalaryModal] = useState(false);
  const data = JSON.parse(localStorage.getItem('storage:user'));

  const handleToggleInputSalary = (id) => {
    setToggleInputSalary((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const [editedSalary, setEditedSalary] = useState({});

  const handleInputChange = (id, newValue) => {
    setEditedSalary((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };

  const handleInputBlur = (id) => {
    const newValue = editedSalary[id];

    putUserSalary(id, newValue).then(res => {
      if(res.data.success) {
        setSuccessChangeSalaryModal(!successChangeSalaryModal);
      } else {
        setMessageChangeSalaryError(res.data.errors[0].message);
        setFailedChangeSalaryModal(!failedDelaySalaryModal);
      }
    })
  };

  useEffect(() => {
    dispatch(getUsersFetchingAction(query));
  }, [query, dispatch, refreshCounter])

  useEffect(() => {
    setQuery((prevState) => {
      return {
        ...prevState,
        start: (currentPage - 1) * pageLimit,
        limit: pageLimit,
      };
    });
  }, [currentPage, pageLimit]);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangePageSize = (newSize) => {
    setCurrentPage(1);
    setPageLimit(newSize);
  };

  const applyFilterForm = (value) => {
    return setQuery({...query, search_query: value?.search, role: value?.selectRoles?.value, is_active: value?.selectStatus?.value});
  }

  const resetFilterForm = () => {
    return setQuery({...query, search_query: '', role: '', is_active: null});
  }

  const checkHiddenColumns = () => {
    if(['PM', 'DEV', 'CLIENT'].includes(userRole)) {
      return ['role', 'status', 'salary', 'min_non_upwork_sale_rate', 'min_upwork_sale_rate', 'optimal_sale_rate', 'vacation_days', 'actions'];
    } else if (['FIN'].includes(userRole)) {
      return ['min_non_upwork_sale_rate', 'min_upwork_sale_rate', 'optimal_sale_rate', 'actions'];
    } else if (['SALES'].includes(userRole)) {
      return ['salary', 'vacation_days'];
    }

    return [];
  }

  const handleDeleteUser = () => {
    deleteUser(deleteId).then(res => {
      if(res.data.success) {
        setSuccessDeletedModal(!successDeletedModal);
      } else {
        setMessageError(res.data.errors[0].message);
        setFailedDeleteModal(!failedDeleteModal);
      }
    })
  }

  const handleActivateUser = () => {
    putActivateUser(activateId).then(res => {
      if(res.data.success) {
        setSuccessActivateModal(!successActivateModal);
        setRefreshCounter(refreshCounter + 1);
      } else {
        setMessageActivateError(res.data.errors[0].message);
        setFailedActivateModal(!failedActivateModal);
      }
    })
  }

  const handleDeactivateUser = () => {
    putDeactivateUser(deactivateId).then(res => {
      if(res.data.success) {
        setSuccessDeactivateModal(!successDeactivateModal);
        setRefreshCounter(refreshCounter + 1);
      } else {
        setMessageDeactivateError(res.data.errors[0].message);
        setFailedDeactivateModal(!failedDeactivateModal);
      }
    })
  }

  const handleSubmitDelaySalaryModalForm = (value) => {
    postDelaySalaryUser(value, delaySalaryId).then(res => {
      if(res.data.success) {
        setDelaySalaryModal(false);
        setSuccessDelaySalaryModal(!successDelaySalaryModal);
      } else {
        setMessageDelaySalaryError(res.data.errors[0].message);
        setFailedDelaySalaryModal(!failedDelaySalaryModal);
      }
    })
  }

  return (
    <Container>
      <Row>
        {
          userRole === "ADMIN" ? (
            <Col className="col-12 d-flex justify-content-end">
              <button className="btn btn-success" onClick={() => navigate("/dashboard/users/add")}>Create User</button>
            </Col>
          ) : null
        }
        <Col className="col-12 pl-0 pr-0">
          <UsersFilterForm
            userRoles={users.map(u => { return { id: u.role, label: u.role }})}
            onSubmit={applyFilterForm}
            resetForm={resetFilterForm}
            userRole={userRole}
          />
        </Col>
        <Col>
          <DataReactTable
            tableName={'Users'}
            sortTable={true}
            search={false}
            classList={"table-users"}
            explanation={userRole === "SALES" || userRole === "ADMIN"}
            pagination={{
              onChangePageSize: handleChangePageSize,
              onChangePage: handleChangePage,
              currentPage,
              totalRecords,
              pageLimit,
            }}
            reactTableData={{
              tableHeaderData: _.filter(columns, c => !checkHiddenColumns().includes(c.accessor)), tableRowsData: users?.map((c) => {
                const isInputVisible = toggleInputSalary[c.id] || false;

                return {
                  ...c,
                  id: `${c.id}`,
                  name: `${c.first_name} ${c.last_name}`,
                  status: <div className="status">{c.is_active ? 'Active' : 'Blocked'} <br/> <span>{c.last_login}</span></div>,
                  salary: <>{c.salary} {!!c?.delayed_salary?.value ? (
                    <>
                      <ReactTooltip id={`usdIcon-${c.id}`} type="dark">
                        <span style={{ color: 'white' }}>
                          Salary will be raised to ${c?.delayed_salary?.value} on {monthNames[Number(c?.delayed_salary?.month)]}
                        </span>
                      </ReactTooltip>
                      <span className="wrapper-usdIcon" data-tip data-for={`usdIcon-${c.id}`}><CurrencyUsdIcon className="p-0" color="#fff" size={16} /></span>
                    </>
                    ) : null} <br/>
                    {data.role === Roles.ADMIN || data.role === Roles.FIN ? <>{isInputVisible ?
                      (<InputOfficialSalary
                          value={editedSalary[c.id] || c.official_salary}
                          onChange={(e) => handleInputChange(c.id, e.target.value)}
                          onBlur={(e) => handleInputBlur(c.id, e.target.value)}/>
                      ) : Number(c.official_salary)} <EditSalaryIcon toggleInput={() => handleToggleInputSalary(c.id)} /></> : Number(c.official_salary)} <br/>
                    {c.salary_up}</>,
                  min_non_upwork_sale_rate: `$ ${c.min_non_upwork_sale_rate} h`,
                  min_upwork_sale_rate: `$ ${c.min_upwork_sale_rate} h`,
                  optimal_sale_rate: `$ ${c.optimal_sale_rate} h`,
                  vacation_days: `${c.vacation_days_available} (${c.vacation_days})`,
                  actions:
                    <>
                      {
                        userRole !== "SALES" ? (
                          <>
                            <ReactTooltip id="deleteIcon" type="dark">
                              <span style={{ color: 'white' }}>
                                Delete
                              </span>
                            </ReactTooltip>
                            <button
                              style={{border: 0, background: "transparent"}}
                              data-tip
                              data-for="deleteIcon"
                            >
                              <DeleteIcon
                                color="#b1c3c8"
                                size={18}
                                onClick={() => {
                                  setDeleteId(c.id)
                                  setConfirmModal(true)
                                }}
                              />
                            </button>
                            <ReactTooltip id="editIcon" type="dark">
                              <span style={{ color: 'white' }}>
                                Edit
                              </span>
                            </ReactTooltip>
                            <button
                              data-tip
                              data-for="editIcon"
                              style={{border: 0, background: "transparent"}}
                              onClick={() => navigate(`/dashboard/users/${c.id}/edit`)}
                            >
                              <PencilIcon color="#b1c3c8" size={18} />
                            </button>
                          </>
                        ) : null
                      }

                      <ReactTooltip id="caseIcon" type="dark">
                        <span style={{ color: 'white' }}>
                          Work History
                        </span>
                      </ReactTooltip>
                      <button
                        style={{border: 0, background: "transparent"}}
                        data-tip
                        data-for="caseIcon"
                      >
                        <BriefcaseIcon
                          color="#b1c3c8"
                          size={18}
                          onClick={() => navigate(`/dashboard/users/${c.id}/work-history`)}
                        />
                      </button>

                      {
                        userRole !== "SALES" ? (
                          <>
                            <ReactTooltip id="clockIcon" type="dark">
                              <span style={{ color: 'white' }}>
                                Delay Salary
                              </span>
                            </ReactTooltip>
                            <button
                              style={{border: 0, background: "transparent"}}
                              data-tip
                              data-for="clockIcon"
                            >
                              <ClockTimeFourIcon
                                color="#b1c3c8"
                                size={18}
                                onClick={() => {
                                  setDelaySalaryId(c.id);
                                  setSalaryUser(Number(c.salary.replace(/,/g, '')));
                                  setSalaryUserName(`${c.first_name} ${c.last_name}`);
                                  setDelaySalaryModal(true);
                                }}
                              />
                            </button>
                            {
                              c.role !== "GUEST" ? (
                                <>
                                  <ReactTooltip id="arrowRightIcon" type="dark">
                                    <span style={{ color: 'white' }}>
                                      Login As
                                    </span>
                                  </ReactTooltip>
                                  <button
                                    style={{border: 0, background: "transparent"}}
                                    data-tip
                                    data-for="arrowRightIcon"
                                  >
                                    <ArrowRightThinCircleOutlineIcon
                                      color="#b1c3c8"
                                      size={18}
                                      onClick={() => {
                                        dispatch(loginAs(c, true));
                                      }}
                                    />
                                  </button>
                                </>
                              ) : null
                            }
                          </>
                        ) : null
                      }
                      {
                        userRole !== "SALES" ? (
                          <TableButton
                            isActive={!!c.is_active}
                            id={c.id}
                            setActivateId={setActivateId}
                            setActivateModal={setActivateModal}
                            setDeactivateId={setDeactivateId}
                            setDeactivateModal={setDeactivateModal}
                          />
                        ) : null
                      }
                    </>,
                };
              }),
            }}
          />
          {
            errors ? (<div>{errors}</div>) : null
          }
          {
            delaySalaryModal && (<DelaySalaryModalForm
                                    toggle={() => setDelaySalaryModal(!delaySalaryModal)}
                                    setDelaySalaryModal={setDelaySalaryModal}
                                    modal={delaySalaryModal}
                                    onSubmit={handleSubmitDelaySalaryModalForm}
                                    salaryUser={salaryUser}
                                    salaryNameUser={salaryNameUser}
                                />)
          }
          <ConfirmModal
            color="danger"
            btn="Default"
            message={`Are you sure you want to delete user #${deleteId}?`}
            toggle={() => setConfirmModal(!confirmModal)}
            modal={confirmModal}
            onNext={handleDeleteUser}
          />
          <CustomModal
            successModal={failedDeleteModal}
            toggleCloseModal={() => setFailedDeleteModal(!failedDeleteModal)}
            textModal={messageError}
            color={"danger"}
          />
          <CustomModal
            successModal={successDeletedModal}
            toggleCloseModal={() => {
              setSuccessDeletedModal(!successDeletedModal);
              setRefreshCounter(refreshCounter + 1);
            }}
            textModal={`User №${deleteId} was successfully deleted!`}
            color={"success"}
          />
          <ConfirmModal
            color="primary"
            btn="Default"
            message={`Are you sure you want to activate user #${activateId}?`}
            toggle={() => setActivateModal(!activateModal)}
            modal={activateModal}
            onNext={handleActivateUser}
          />
          <CustomModal
            successModal={failedActivateModal}
            toggleCloseModal={() => setFailedActivateModal(!failedActivateModal)}
            textModal={messageActivateError}
            color={"danger"}
          />
          <ConfirmModal
            color="primary"
            btn="Default"
            message={`Are you sure you want to deactivate user #${deactivateId}?`}
            toggle={() => setDeactivateModal(!deactivateModal)}
            modal={deactivateModal}
            onNext={handleDeactivateUser}
          />
          <CustomModal
            successModal={failedDeactivateModal}
            toggleCloseModal={() => setFailedDeactivateModal(!failedDeactivateModal)}
            textModal={messageDeactivateError}
            color={"danger"}
          />
          <CustomModal
            successModal={failedDelaySalaryModal}
            toggleCloseModal={() => setFailedDelaySalaryModal(!failedDelaySalaryModal)}
            textModal={messageDelaySalaryError}
            color={"danger"}
          />
          <CustomModal
            successModal={successDelaySalaryModal}
            toggleCloseModal={() => {
              setSuccessDelaySalaryModal(!successDelaySalaryModal);
              setRefreshCounter(refreshCounter + 1);
            }}
            textModal={`Salary with delay for user №${delaySalaryId} was set successfully!`}
            color={"success"}
          />
          <CustomModal
            successModal={failedChangeSalaryModal}
            toggleCloseModal={() => setFailedChangeSalaryModal(!failedChangeSalaryModal)}
            textModal={messageChangeSalaryError}
            color={"danger"}
          />
          <CustomModal
            successModal={successChangeSalaryModal}
            toggleCloseModal={() => {
              setSuccessChangeSalaryModal(!successChangeSalaryModal);
              setRefreshCounter(refreshCounter + 1);
            }}
            textModal={`Official salary was successfully changed!`}
            color={"success"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Users;