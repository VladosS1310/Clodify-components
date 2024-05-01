import React, { useEffect, useState } from 'react';
import { reset } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
import { Button, Col, Container, Row, Card, CardBody } from 'reactstrap';
import DeleteIcon from 'mdi-react/DeleteIcon';
import SettingsIcon from 'mdi-react/SettingsIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import DataReactTable from '../../../../Tables/DataTable/components/DataReactTable';
import Loading from '../../../../../shared/components/Loading';
import { FullWideNotification } from '../../../../../shared/components/Notification';
import { columns } from './environmentsDataColumns';
import FormAddNewEnvironment from './FormAddNewEnvironment/FormAddNewEnvironment';
import FormEditEnvironment from './FormEditEnvironments';
import ConfirmModal from './Variables/ConfirmModal/ConfirmModal';
import {
  getEnvironmentsFetchingAction,
  postEnvironmentsFail,
  postEnvironmentsFetchingAction,
  deleteEnvironmentAction,
  editEnvironmentAction,
} from '../../../../../redux/actions/environmentsActions';
import CustomAlert from '../../../../../shared/components/customComponents/CustomAlert/CustomAlert';
import ReactTooltip from 'react-tooltip';


const Environments = () => {
  const { id } = useParams();
  const { t } = useTranslation('common');
  const { environments, loading, errors, modalLoading, modalErrors } =
    useSelector((state) => state.environments);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [deletedId, setDeletedId] = useState('');
  const [editEnv, setEditEnv] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('storage:user'));

  const toggle = () => {
    setModal((prevState) => !prevState);
    dispatch(postEnvironmentsFail([]));
    dispatch(reset('add_new_environment'));
  };

  const toggleDelete = (val = '') => {
    setDeletedId(val);
  };

  const toggleEdit = (value) => {
    dispatch(postEnvironmentsFail([]));

    if (!_.isEmpty(value)) {
      return setEditEnv(value);
    }

    setEditEnv({});

    return '';
  };

  const handleSubmit = (value) => {
    dispatch(
      postEnvironmentsFetchingAction(
        id,
        value.branch,
        value.roles.split(/[\s,]/).filter((s) => s.length),
        toggle,
      ),
    );
  };

  const handleDelete = () => {
    dispatch(deleteEnvironmentAction(id, deletedId, toggleDelete));
  };

  const handleEdit = (value) => {
    dispatch(
      editEnvironmentAction(
        id,
        value.id,
        value.branch,
        value.access_roles.split(/[\s,]/).filter((s) => s.length),
        toggleEdit,
      ),
    );
  };

  useEffect(() => {
    if (data.role === 'ADMIN' || data.role === 'SALE' || data.role === 'PM') {
      dispatch(getEnvironmentsFetchingAction(id));
    } else {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 7000);
    }
  }, [data.role, dispatch, id]);

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (errors.length > 0) {
      return (
        <Row>
          <Col sm={12}>
            <Card style={{ marginTop: '20px' }}>
              <CardBody>
                {errors.map((error, i) => {
                  return (
                    <CustomAlert
                      color="danger"
                      className="alert--bordered"
                      icon
                      key={i}
                    >
                      <p>
                        <span className="bold-text">{error.param}</span>{' '}
                        {error.message}
                      </p>
                    </CustomAlert>
                  );
                })}
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col sm={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={toggle} color="primary" style={{ marginBottom: '15px' }}>
            {t('environment.tittle_button_add')}
          </Button>
        </Col>
        <DataReactTable
          tableName={t('environment.title_table')}
          sortTable
          search
          pagination
          reactTableData={{
            tableHeaderData: columns,
            tableRowsData: environments?.map((c) => {
              return {
                ...c,
                id: `${c.id}`,
                project_name: c.project.project_name,
                project_id: `${c.project.project_id}`,
                actions: (
                  <div>
                    <ReactTooltip id="editIcon" type="dark">
                      <span style={{ color: 'white' }}>
                        Edit
                      </span>
                    </ReactTooltip>
                    <button data-tip
                            data-for="editIcon"
                            style={{ border: 0, background: 'transparent' }}>
                      <PencilIcon
                        color="#b1c3c8"
                        data-testid="edit-button"
                        size={18}
                        onClick={() => toggleEdit(c)}
                      />
                    </button>
                    <ReactTooltip id="deleteIcon" type="dark">
                      <span style={{ color: 'white' }}>
                        Delete
                      </span>
                    </ReactTooltip>
                    <button
                      data-tip
                      data-for="deleteIcon"
                      style={{ border: 0, background: 'transparent' }}>
                      <DeleteIcon
                        color="#b1c3c8"
                        size={18}
                        onClick={() => toggleDelete(c.id)}
                        data-testid="delete-button"
                      />
                    </button>
                    <ReactTooltip id="settingsIcon" type="dark">
                      <span style={{ color: 'white' }}>
                        Variables Settings
                      </span>
                    </ReactTooltip>
                    <button data-tip
                            data-for="settingsIcon"
                            style={{ border: 0, background: 'transparent' }}>
                      <SettingsIcon
                        onClick={() =>
                          navigate(
                            `/dashboard/projects/${id}/environments/${c.branch}/variables`,
                          )
                        }
                        color="#b1c3c8"
                        size={18}
                      />
                    </button>
                  </div>
                ),
              };
            }),
          }}
        />
        <FormAddNewEnvironment
          modal={modal}
          toggle={toggle}
          onSubmit={handleSubmit}
          errors={modalErrors}
          loading={modalLoading}
        />
        <ConfirmModal
          color="danger"
          btn="Default"
          message="Are you sure you want to delete it?"
          toggle={toggleDelete}
          modal={deletedId}
          onNext={handleDelete}
        />
        {editEnv.id && (
          <FormEditEnvironment
            modal={editEnv}
            toggle={toggleEdit}
            errors={modalErrors}
            loading={modalLoading}
            data={editEnv}
            onSubmit={handleEdit}
          />
        )}
      </Row>
    );
  };

  return (
    <Container>
      {showNotification && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '0',
            zIndex: '999',
          }}
        >
          <FullWideNotification
            color="danger"
            message="You do not have sufficient permissions to view this page!"
          />
        </div>
      )}
      {renderContent()}
    </Container>
  );
};

export default Environments;
