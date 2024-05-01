import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectsFetchingAction } from '../../../redux/actions/projectsActions';
import { columns } from './components/ProjectsTableColumns';
import DataReactTable from '../../Tables/DataTable/components/DataReactTable';
import ReactTooltip from 'react-tooltip';
import DeleteIcon from 'mdi-react/DeleteIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import _ from "lodash";
import ConfirmModal from '../../../shared/components/customComponents/CustomConfirmModal/ConfirmModal';
import CustomModal from '../../../shared/components/customComponents/CustomModal/CustomModal';
import {
  deleteProject,
  putActivateProject,
  putDeactivateProject,
} from '../../../utils/api';
import ProjectsFilterForm from './components/ProjectsFilterForm/ProjectsFilterForm';
import { useNavigate } from 'react-router-dom';
import Roles from '../../../config/roles';


const Developers = ({p}) => {
  const [show, setShow] = useState(false);

  return <>
    {
      _.map(_.slice(p, 0, show ? p?.length : 4), d => {
        return (
          <>
            {d?.first_name} {d?.last_name} <br/>
          </>
        )
      })
    }
    {
      p?.length > 4 ?
        (<button
          onClick={() => setShow(!show)}
          style={{padding: "2px 5px", display: "block", background: "#fff", border: "1px solid #efefef"}}
        > {show ? "hide" : "..."}
        </button>) : null
    }
  </>
}

const TableButton = ({isActive, setActivateId, id, setActivateModal, setDeactivateId, setDeactivateModal}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMetaData = () => {
    const obj = {
      btnLabel: "",
      btnClass: ""
    }
    if(isActive === "INPROGRESS") {
      obj.btnLabel = "Activated";
      obj.btnClass = "btn-activated";
    }
    if(isHovered && isActive === "INPROGRESS") {
      obj.btnLabel = "Deactivate";
      obj.btnClass = "btn-deactivated";
    }

    if(isActive === "ONHOLD" || isActive === "NEW") {
      obj.btnLabel = "Deactivated";
      obj.btnClass = "btn-deactivated";
    }
    if((isActive === "ONHOLD" && isHovered) || (isActive === "NEW" && isHovered)) {
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
        if(isActive === "ONHOLD" || isActive === "NEW") {
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

const Projects = () => {
  const {projects, errors, totalRecords} = useSelector(state => state.projects);
  const userRole = useSelector(state => state?.auth?.impersonatedUser?.role || state?.auth?.user.role);
  let data = JSON.parse(localStorage.getItem("storage:user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [query, setQuery] = useState({start: 0, limit: 10, search_query: ''});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [activateId, setActivateId] = useState(null);
  const [activateModal, setActivateModal] = useState(false);
  const [deactivateId, setDeactivateId] = useState(null);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [messageActivateError, setMessageActivateError] = useState('');
  const [failedActivateModal, setFailedActivateModal] = useState(false);
  const [successActivateModal, setSuccessActivateModal] = useState(false);
  const [messageDeactivateError, setMessageDeactivateError] = useState('');
  const [failedDeactivateModal, setFailedDeactivateModal] = useState(false);
  const [successDeactivateModal, setSuccessDeactivateModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [failedDeleteModal, setFailedDeleteModal] = useState(false);
  const [successDeletedModal, setSuccessDeletedModal] = useState(false);

  useEffect(() => {
    dispatch(getProjectsFetchingAction(query))
  }, [query, dispatch, refreshCounter])

  useEffect(() => {
    setQuery((prevState) => {
      return {
        ...prevState,
        start: (currentPage - 1) * pageLimit,
        limit: pageLimit
      }});
  }, [currentPage, pageLimit]);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangePageSize = (newSize) => {
    setCurrentPage(1);
    setPageLimit(newSize);
  };

  const handleActivateProject = () => {
    putActivateProject(activateId).then(res => {
      if(res.data.success) {
        setSuccessActivateModal(!successActivateModal);
        setRefreshCounter(refreshCounter + 1);
      } else {
        setMessageActivateError(res.data.errors[0].message);
        setFailedActivateModal(!failedActivateModal);
      }
    })
  }

  const handleDeactivateProject = () => {
    putDeactivateProject(deactivateId).then(res => {
      if(res.data.success) {
        setSuccessDeactivateModal(!successDeactivateModal);
        setRefreshCounter(refreshCounter + 1);
      } else {
        setMessageDeactivateError(res.data.errors[0].message);
        setFailedDeactivateModal(!failedDeactivateModal);
      }
    })
  }

  const handleDeleteProject = () => {
    deleteProject(deleteId).then(res => {
      if(res.data.success) {
        setSuccessDeletedModal(!successDeletedModal);
      } else {
        setMessageError(res.data.errors[0].message);
        setFailedDeleteModal(!failedDeleteModal);
      }
    })
  }

  const applyFilterForm = (value) => {
    return setQuery({...query, search_query: value?.search});
  }

  const resetFilterForm = () => {
    return setQuery({...query, search_query: ''});
  }

  const checkHiddenColumns = () => {
    if(['CLIENT'].includes(userRole)) {
      return ['cost', 'clients', 'actions'];
    }

    return [];
  }

  return (
    <Container>
      <Row>
        {
          (data.role === Roles.ADMIN || data.role === Roles.SALES) && (
            <Col className="col-12 d-flex justify-content-end">
              <button className="btn btn-success" onClick={() => navigate("/dashboard/projects/add")}>Create Projects</button>
            </Col>
          )
        }
        <Col className="col-12 pl-0 pr-0">
          <ProjectsFilterForm
            onSubmit={applyFilterForm}
            resetForm={resetFilterForm}
          />
        </Col>
        <Col className="col-12">
          <DataReactTable
            tableName={"Projects"}
            classList={"table-projects"}
            sortTable={false}
            search={false}
            pagination={{
              onChangePageSize: handleChangePageSize,
              onChangePage: handleChangePage,
              currentPage,
              totalRecords,
              pageLimit
            }}
            reactTableData={{tableHeaderData: _.filter(columns, c => !checkHiddenColumns().includes(c.accessor)), tableRowsData: projects?.map(p => {
              return {
                ...p,
                developers: <Developers p={p.developers} />,
                clients: p?.clients?.map(c => {
                  return (
                    <span style={{whiteSpace: "nowrap"}}>
                      {c.first_name + " " + c.last_name} <br />
                    </span>
                  )
                }),
                actions: <div className={"tableActions"}>
                  <ReactTooltip id="deleteIcon" type="dark">
                    <span style={{ color: 'white' }}>
                      Delete
                    </span>
                  </ReactTooltip>
                  <button
                    data-tip
                    data-for="deleteIcon"
                    style={{border: 0, background: 'transparent'}}>
                    <DeleteIcon
                      onClick={() => {
                        setDeleteId(p.id)
                        setConfirmModal(true)}}
                      size={18}
                      color="#b1c3c8" />
                  </button>
                  {
                    data.role === Roles.ADMIN ? (<>
                      <ReactTooltip id="editIcon" type="dark">
                    <span style={{ color: 'white' }}>
                      Edit
                    </span>
                      </ReactTooltip>
                      <button
                        data-tip
                        data-for="editIcon"
                        style={{border: 0, background: 'transparent'}}
                        onClick={() => navigate(`/dashboard/projects/${p.id}/edit`)}
                      >
                        <PencilIcon color="#b1c3c8" size={18} />
                      </button>
                    </>) : null
                  }

                  <TableButton
                    isActive={p.status}
                    id={p.id}
                    setActivateId={setActivateId}
                    setActivateModal={setActivateModal}
                    setDeactivateId={setDeactivateId}
                    setDeactivateModal={setDeactivateModal}
                  />
                </div>
              }
             })}}
          />

          {
            errors ? (<div>{errors}</div>) : null
          }

          <ConfirmModal
            color="primary"
            btn="Default"
            message={`Are you sure you want to activate project #${activateId}?`}
            toggle={() => setActivateModal(!activateModal)}
            modal={activateModal}
            onNext={handleActivateProject}
          />
          <CustomModal
            successModal={failedActivateModal}
            toggleCloseModal={() => setFailedActivateModal(!failedActivateModal)}
            textModal={messageActivateError}
            color={"danger"}
          />
          <ConfirmModal
            color="danger"
            btn="Default"
            message={`Are you sure you want to deactivate project #${deactivateId}?`}
            toggle={() => setDeactivateModal(!deactivateModal)}
            modal={deactivateModal}
            onNext={handleDeactivateProject}
          />
          <CustomModal
            successModal={failedDeactivateModal}
            toggleCloseModal={() => setFailedDeactivateModal(!failedDeactivateModal)}
            textModal={messageDeactivateError}
            color={"danger"}
          />
          <ConfirmModal
            color="danger"
            btn="Default"
            message={`Are you sure you want to delete project #${deleteId}?`}
            toggle={() => setConfirmModal(!confirmModal)}
            modal={confirmModal}
            onNext={handleDeleteProject}
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
            textModal={`Record #${deleteId} has been deleted!`}
            color={"success"}
          />
        </Col>
      </Row>
    </Container>
  )
};

export default Projects;