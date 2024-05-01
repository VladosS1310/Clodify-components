import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from 'redux-form';
import _ from 'lodash';
import { Button, Card, CardBody, Col, Container, Modal, Row } from 'reactstrap';
import PencilIcon from 'mdi-react/PencilIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import ShareIcon from 'mdi-react/ShareIcon';
import Loading from '../../../../../../shared/components/Loading';
import {
  getVariablesFetchingAction,
  addVariablesAction,
  modalsVariablesFail,
  editVariablesAction,
  deleteVariablesAction,
} from '../../../../../../redux/actions/variablesActions';
import DataReactTable from '../../../../../Tables/DataTable/components/DataReactTable';
import { columns, sharedColumns } from './variablesDataColumns';
import FormAddNewVariable from './FormAddNewVariable/FormAddNewVariable';
import FormShareVariable from './FormShareVariable/FormShareVariable';
import ConfirmModal from './ConfirmModal/ConfirmModal';
import FormEditVariable from './FormEditVariable/FormEditVariable';
import CustomAlert from '../../../../../../shared/components/customComponents/CustomAlert/CustomAlert';
import { postUnShareVariable } from '../../../../../../utils/api';
import CustomModal from '../../../../../../shared/components/customComponents/CustomModal/CustomModal';


const Variables = () => {
  const { id, env_id } = useParams();
  const { t } = useTranslation('common');
  const { data, loading, errors, modalLoading, modalErrors } = useSelector(
    (state) => state.variables,
  );
  const { variables, sharedVariables } = data;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [sharedId, setSharedId] = useState('');
  const [deletedId, setDeletedId] = useState('');
  const [editVariable, setEditVariable] = useState({});
  const [successModal, setSuccessModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggle = () => {
    setModal((prevState) => !prevState);
    dispatch(reset('add_new_variable'));
    dispatch(modalsVariablesFail([]));
  };

  const toggleCloseModal = () => {
    setSuccessModal(!successModal);
  }

  const toggleDelete = (val) => {
    if (val) {
      return setDeletedId(val);
    }
    setDeletedId('');
    return '';
  };

  const toggleEdit = (val) => {
    dispatch(modalsVariablesFail([]));

    if (!_.isEmpty(val)) {
      return setEditVariable(val);
    }
    setEditVariable({});

    return '';
  };

  const toggleShare = (val) => {
    dispatch(modalsVariablesFail([]));

    if (val) {
      return setSharedId(val);
    }

    setSharedId('');
    return '';
  };

  const toggleDeleteShareVariable = (deleteId) => {
    postUnShareVariable(+id, deleteId).then(res => {
      if(res.data.success) {
        setShareModal(true);
        setTimeout(() => {
          setRefreshCounter(refreshCounter + 1);
          setShareModal(false);
        }, 3000)
      } else {
        setErrorMessage(res.data.errors[0].message);
        setErrorModal(true);
      }
    })
  }

  const toggleUnShareCloseModal = () => {
    setShareModal(!shareModal);
  }

  const toggleCloseErrorModal = () => {
    setErrorModal(!errorModal);
  }

  const handleSubmit = (value) => {
    dispatch(addVariablesAction(id, env_id, value.key, value.value, toggle, setSuccessModal));
  };

  const handleDelete = () => {
    dispatch(deleteVariablesAction(id, env_id, deletedId, toggleDelete));
  };

  const handleOnEdit = (values) => {
    dispatch(
      editVariablesAction(
        id,
        env_id,
        values.id,
        values.name,
        values.value,
        toggleEdit,
      ),
    );
  };

  useEffect(() => {
    dispatch(getVariablesFetchingAction(id, env_id));
  }, [dispatch, env_id, id, refreshCounter]);

  const prepareRows = () => {
    const rows = [];

    variables.forEach((c) => {
      if (c.name === 'PROJECT_CON_NAME') {
        rows.push({
          ...c,
          id: '',
          actions: '',
        });
        return;
      }

      // TODO refactor shred column when we have API data for them
      rows.push({
        ...c,
        id: `${c.id}`,
        // shared: <span>{c.isShared ? 'Yes' : 'No'}</span>,
        actions: (
          <div>
            <button
              type="button"
              style={{ border: 0, background: 'transparent' }}
            >
              <ShareIcon
                onClick={() => toggleShare(c.id)}
                color="#b1c3c8"
                size={18}
                data-testid="share-button"
              />
            </button>
            <button
              type="button"
              style={{ border: 0, background: 'transparent' }}
            >
              <PencilIcon
                onClick={() => toggleEdit(c)}
                color="#b1c3c8"
                size={18}
                data-testid="edit-button"
              />
            </button>
            <button
              type="button"
              style={{ border: 0, background: 'transparent' }}
            >
              <DeleteIcon
                onClick={() => toggleDelete(c.id)}
                color="#b1c3c8"
                size={18}
              />
            </button>
          </div>
        ),
      });
    });

    return rows;
  };

  const prepareSharedRows = () => {
    const rows = [];

    sharedVariables.forEach((item) => {
      rows.push({
        ...item,
        id: `${item.id}`,
        actions: (
          <div>
            <button
              type="button"
              style={{ border: 0, background: 'transparent' }}
            >
              <DeleteIcon
                onClick={() => toggleDeleteShareVariable(item.id)}
                color="#b1c3c8"
                size={18}
              />
            </button>
          </div>
        ),
      });
    });

    return rows;
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (errors.length > 0) {
      return (
        <Row>
          <Col sm={12} style={{position: "absolute" }}>
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

    if (sharedId) {
      return <FormShareVariable id={sharedId}  toggleShare={toggleShare} />;
    }

    return (
      <Row>
        <Col sm={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={toggle} color="primary" style={{ margin: '20px 0' }}>
            {t('variables.tittle_button_add')}
          </Button>
        </Col>
        <Col sm={12}>
          <div className="variables-table">
            <DataReactTable
              tableName={t('variables.title_table')}
              sortTable
              search
              pagination={false}
              reactTableData={{
                tableHeaderData: columns,
                tableRowsData: prepareRows(),
              }}
            />
          </div>
        </Col>
        <Col sm={12}>
          <div className="variables-table">
            <DataReactTable
              tableName={t('variables.title_shared_table')}
              sortTable
              search
              pagination={false}
              reactTableData={{
                tableHeaderData: sharedColumns,
                tableRowsData: prepareSharedRows(),
              }}
            />
          </div>
        </Col>
        <FormAddNewVariable
          modal={modal}
          toggle={toggle}
          mesErrors={modalErrors}
          onSubmit={handleSubmit}
          loading={modalLoading}
        />
        {editVariable.name && (
          <FormEditVariable
            onSubmit={handleOnEdit}
            variable={editVariable}
            modal={editVariable !== ''}
            toggle={toggleEdit}
            loading={modalLoading}
            errors={modalErrors}
          />
        )}
        {
          <CustomModal
            successModal={shareModal}
            toggleCloseModal={toggleUnShareCloseModal}
            textModal={"Variable was unshare successful!"}
            color={"success"}
          />
        }
        {
          <CustomModal
            successModal={errorModal}
            toggleCloseModal={toggleCloseErrorModal}
            textModal={errorMessage}
            color={"danger"}
          />
        }
      </Row>
    );
  };

  return (
    <Container>
      <ConfirmModal
        color="danger"
        btn="Default"
        message="Are you sure you want to delete it?"
        toggle={toggleDelete}
        modal={deletedId !== ''}
        onNext={handleDelete}
      />
      <Modal
        isOpen={successModal}
        toggle={toggleCloseModal}
        modalClassName="ltr-support"
        className="modal-dialog--primary theme-light modal-add-new-variable"
      >
        <div className="modal__header">
          <button
            className="lnr lnr-cross modal__close-btn"
            type="button"
            onClick={toggleCloseModal}
          />
        </div>
        <div className="modal__body">
          <CustomAlert
            color="success"
            className="alert--bordered"
            icon>
            <p>
              <span className="bold-text">Variable was added successful!</span>
            </p>
          </CustomAlert>
        </div>
      </Modal>
      {renderContent()}
    </Container>
  );
};

export default Variables;
