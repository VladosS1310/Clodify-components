import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectFetchingAction, getProjectMonitoringServices} from '../../../../../redux/actions/projectsEditActions';
import { CardBody, Card, Col, Container, Row } from 'reactstrap';
import ProjectsEditForm from './ ProjectsEditForm/ProjectsEditForm';
import { getUsersFetchingAction } from '../../../../../redux/actions/usersActions';
import DeleteIcon from 'mdi-react/DeleteIcon';
import DataReactTable from '../../../../Tables/DataTable/components/DataReactTable';
import {columns} from './DataTableColumns';
import ProjectEditMonitoringForm from './ProjectEditMonitoringForm/ProjectEditMonitoringForm';
import {
  deleteProjectByIdMonitoringServices,
  postProjectByIdMonitoringServices, postProjectMilestones,
  putEditProject,
  putToggleMonitoringServices,
} from '../../../../../utils/api';
import CustomModal from '../../../../../shared/components/customComponents/CustomModal/CustomModal';
import {reset} from 'redux-form';
import ConfirmModal from '../../../../../shared/components/customComponents/CustomConfirmModal/ConfirmModal';
import _ from "lodash";


const TableButton = ({isActive, setToggleId, id, setActivateModal, setDeactivateModal, setIsEnabled}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMetaData = () => {
    const obj = {
      btnLabel: "",
      btnClass: ""
    }
    if(isActive) {
      obj.btnLabel = "Enabled";
      obj.btnClass = "btn-enabled";
    }
    if(isHovered && isActive) {
      obj.btnLabel = "Disable";
      obj.btnClass = "btn-disabled";
    }

    if(!isActive) {
      obj.btnLabel = "Disabled";
      obj.btnClass = "btn-disabled";
    }
    if(!isActive && isHovered) {
      obj.btnLabel = "Enable";
      obj.btnClass = "btn-enabled";
    }

    return obj;
  }

  const {btnLabel, btnClass} = getMetaData();

  return (
    <button
      className={btnClass}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{width: "auto"}}
      onClick={() => {
        if(!isActive) {
          setToggleId(id);
          setIsEnabled(!isActive);
          setActivateModal(true);
        } else {
          setToggleId(id);
          setIsEnabled(!isActive);
          setDeactivateModal(true);
        }
      }}
    >{btnLabel}</button>
  )
}

const ProjectsEdit = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {monitoringServices} = useSelector(state => state.editProjects);
  const [toggleMonitoringForm, setToggleMonitoringForm] = useState(false);
  const [successAddProjectMonitoringModal, setSuccessAddProjectMonitoringModal] = useState(false);
  const [failedAddProjectMonitoringModal, setFailedAddProjectMonitoringModal] = useState(false);
  const [messageAddProjectMonitoringError, setMessageAddProjectMonitoringError] = useState('');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteMonitoringModal, setConfirmDeleteMonitoringModal] = useState(false);
  const [failedDeleteModal, setFailedDeleteModal] = useState(false);
  const [successDeletedModal, setSuccessDeletedModal] = useState(false);
  const [messageProjectMonitoringError, setMessageProjectMonitoringError] = useState('');
  const [toggleId, setToggleId] = useState(null);
  const [activateModal, setActivateModal] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [successToggleModal, setSuccessToggleModal] = useState(false);
  const [failedToggleModal, setFailedToggleModal] = useState(false);
  const [messageToggleError, setMessageToggleError] = useState(false);
  const [isEnabled, setIsEnabled] = useState(null);
  const [editProjectID, setEditProjectId] = useState(null);
  const [successEditProjectModal, setSuccessEditProjectModal] = useState(false);
  const [messageEditProjectError, setMessageEditProjectError] = useState('');
  const [failedEditProjectModal, setFailedEditProjectModal] = useState(false);
  const [failedAddMilestoneModal, setFailedAddMilestoneModal] = useState(false);
  const [messageAddMilestoneError, setMessageAddMilestoneError] = useState('');

  useEffect(() => {
    dispatch(getProjectFetchingAction(params.id));
    dispatch(getProjectMonitoringServices(params.id));
    dispatch(getUsersFetchingAction({limit: "9999", is_active: 1}));
  }, [dispatch, params.id, refreshCounter]);

  const handleAddProjectMonitoring = (values) => {
    postProjectByIdMonitoringServices(params.id, values).then(res => {
      if(res.data.success) {
        setSuccessAddProjectMonitoringModal(!successAddProjectMonitoringModal);
        dispatch(reset('project_edit_monitoring_form'));
      } else {
        setMessageAddProjectMonitoringError(res.data.errors[0].message);
        setFailedAddProjectMonitoringModal(!failedAddProjectMonitoringModal);
      }
    })
  }

  const handleDeleteMonitoringServices = () => {
    deleteProjectByIdMonitoringServices(params.id, deleteId).then(res => {
      if(res.data.success) {
        setSuccessDeletedModal(!successDeletedModal);
        setRefreshCounter(refreshCounter + 1);
      } else {
        setMessageProjectMonitoringError(res.data.errors[0].message);
        setFailedDeleteModal(!failedDeleteModal);
      }
    })
  }

  const handleToggleMonitoringServices = () => {
    putToggleMonitoringServices(params.id, toggleId, isEnabled).then(res => {
      if(res.data.success) {
        setSuccessToggleModal(!successToggleModal);
        setRefreshCounter(refreshCounter + 1);
      } else {
        setMessageToggleError(res.data.errors[0].message);
        setFailedToggleModal(!failedToggleModal);
      }
    })
  }

  const handleSubmit = (value) => {
    putEditProject(params.id, value).then(res => {
      if(res.data.success) {
        setEditProjectId(params.id);
        setSuccessEditProjectModal(!successEditProjectModal);

        !_.isEmpty(value.milestones) && postProjectMilestones(params.id, value).then(res => {
          if(!res.data.success) {
            setMessageAddMilestoneError(res.data.errors[0].message);
            setFailedAddMilestoneModal(!failedAddMilestoneModal);
          }
        })
      } else {
        setMessageEditProjectError(res.data.errors[0].message);
        setFailedEditProjectModal(!failedEditProjectModal);
      }
    })
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <ProjectsEditForm onSubmit={handleSubmit} />
              <h4 style={{padding: "0 15px"}}>Monitoring Services</h4>
              <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-success" onClick={() => setToggleMonitoringForm(!toggleMonitoringForm)}>Add a Monitoring</button>
              </div>
              {
                toggleMonitoringForm ? (<ProjectEditMonitoringForm onSubmit={handleAddProjectMonitoring} />) : null
              }
              <DataReactTable
                classList={"table-monitoring"}
                sortTable={false}
                search={false}
                pagination={false}
                reactTableData={{tableHeaderData: columns, tableRowsData: monitoringServices?.map((c) => {
                    return {...c,
                      actions:
                        <div className={"tableActions"}>
                          <TableButton
                            isActive={c.is_enabled}
                            id={c.id}
                            setToggleId={setToggleId}
                            setActivateModal={setActivateModal}
                            setDeactivateModal={setDeactivateModal}
                            setIsEnabled={setIsEnabled}
                          />
                          <button
                            onClick={() => {
                              setDeleteId(c.id)
                              setConfirmDeleteMonitoringModal(true)}}
                            style={{border: 0, background: 'transparent'}}
                          ><DeleteIcon size={18} color="#b1c3c8" /></button>
                        </div>
                    }
                  })}} />

              <CustomModal
                successModal={failedAddProjectMonitoringModal}
                toggleCloseModal={() => setFailedAddProjectMonitoringModal(!failedAddProjectMonitoringModal)}
                textModal={messageAddProjectMonitoringError}
                color={"danger"}
              />
              <CustomModal
                successModal={successAddProjectMonitoringModal}
                toggleCloseModal={() => {
                  setSuccessAddProjectMonitoringModal(!successAddProjectMonitoringModal);
                  setRefreshCounter(refreshCounter + 1);
                }}
                textModal={`Monitoring Services has been added!`}
                color={"success"}
              />
              <ConfirmModal
                color="danger"
                btn="Default"
                message={`Are you sure you want to delete monitoring services #${deleteId}?`}
                toggle={() => setConfirmDeleteMonitoringModal(!confirmDeleteMonitoringModal)}
                modal={confirmDeleteMonitoringModal}
                onNext={handleDeleteMonitoringServices}
              />
              <CustomModal
                successModal={failedDeleteModal}
                toggleCloseModal={() => setFailedDeleteModal(!failedDeleteModal)}
                textModal={messageProjectMonitoringError}
                color={"danger"}
              />
              <ConfirmModal
                color="primary"
                btn="Default"
                message={`Are you sure you want to enable monitoring service #${toggleId}?`}
                toggle={() => setActivateModal(!activateModal)}
                modal={activateModal}
                onNext={handleToggleMonitoringServices}
              />
              <ConfirmModal
                color="danger"
                btn="Default"
                message={`Are you sure you want to disable monitoring service #${toggleId}?`}
                toggle={() => setDeactivateModal(!deactivateModal)}
                modal={deactivateModal}
                onNext={handleToggleMonitoringServices}
              />
              <CustomModal
                successModal={failedToggleModal}
                toggleCloseModal={() => setFailedToggleModal(!failedToggleModal)}
                textModal={messageToggleError}
                color={"danger"}
              />
              <CustomModal
                successModal={failedEditProjectModal}
                toggleCloseModal={() => setFailedEditProjectModal(!failedEditProjectModal)}
                textModal={messageEditProjectError}
                color={"danger"}
              />
              <CustomModal
                successModal={successEditProjectModal}
                toggleCloseModal={() => {
                  setSuccessEditProjectModal(!successEditProjectModal);
                  setRefreshCounter(refreshCounter + 1);
                }}
                textModal={`Project #${editProjectID} has been changed!`}
                color={"success"}
              />
              <CustomModal
                successModal={failedAddMilestoneModal}
                toggleCloseModal={() => setFailedAddMilestoneModal(!failedAddMilestoneModal)}
                textModal={messageAddMilestoneError}
                color={"danger"}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
};

export default ProjectsEdit;