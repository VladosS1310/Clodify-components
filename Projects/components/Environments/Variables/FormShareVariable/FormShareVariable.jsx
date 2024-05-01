import React, { useEffect, useState } from 'react';
import { Field, formValueSelector, reduxForm, reset } from 'redux-form';
import { useSelector, useDispatch, connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  Spinner,
  // Table,
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Modal,
} from 'reactstrap';
import { debounce, includes } from 'lodash';
import { renderSelectField } from '../../../../../../../shared/components/form/Select';
import { getProjects, getSearchProjects } from '../../../../../../../utils/api';
import validate from './validate';
import { shareVariablesAction } from '../../../../../../../redux/actions/variablesActions';
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import CustomAlert from '../../../../../../../shared/components/customComponents/CustomAlert/CustomAlert';


let FormShareVariable = ({ toggleShare, id, select }) => {
  const user = JSON.parse(localStorage.getItem('storage:user'));
  const { modalLoading, modalErrors } = useSelector((state) => state.variables);
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);

  const [successModal, setSuccessModal] = useState(false);

  const onSearchProjects = (val, { action }) => {
    const excludedAction = ['set-value', 'input-blur', 'menu-close'];
    if (includes(excludedAction, action)) return;
    getSearchProjects(val).then((res) => {setProjects(res.data.data.projects);});
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (select) {
      dispatch(shareVariablesAction(select.value, id, setSuccessModal));
      dispatch(reset('share_form_variable'));
    }
  };

  useEffect(() => {
    if (user.role === 'ADMIN') {
      getProjects().then((res) => {
        setProjects(res.data.data.projects);
      });
    }
  }, [user.role]);

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <CardBody>
            {/* <div className="card__title">
              <h5 className="bold-text">Shared with</h5>
            </div> */}
            {/* TODO wait until API will be reade<Table striped responsive></Table> */}

            {modalErrors.length > 0 &&
              modalErrors.map((error, i) => {
                return (
                  <CustomAlert
                    color="danger"
                    className="alert--bordered"
                    icon
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                  >
                    <p>
                      <span className="bold-text">{error.param}</span>{' '}
                      {error.message}
                    </p>
                  </CustomAlert>
                );
              })}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">Select PROJECTS</span>
                <div className="form__form-group-field">
                  <Field
                    name="select"
                    component={renderSelectField}
                    type="text"
                    options={projects?.map((s) => ({
                      value: `${s.id}`,
                      label: s.name,
                    }))}
                    onInputChange={debounce(onSearchProjects, 300)}
                  />
                </div>
              </div>
              <ButtonToolbar className="form__button-toolbar">
                <Button color="primary" type="submit">
                  Save
                </Button>
                {modalLoading && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </ButtonToolbar>
            </form>
          </CardBody>
        </Card>
      </Col>
      <Col sm={12}>
        <Button color="warning" onClick={() => toggleShare(false)}>
          Cancel
        </Button>
      </Col>
      <Container>
        <ConfirmModal
            color="danger"
            btn="Default"
            message="Are you sure you want to delete it?"
            //toggle={toggleDelete}
            //modal={deletedId !== ''}
            //onNext={handleDelete}
        />
        <Modal
            isOpen={successModal}
            toggle={() => setSuccessModal(false)}
            setSuccessModal={setSuccessModal}
            title={"Share"}
            modalClassName="ltr-support"
            className="modal-dialog--primary theme-light modal-add-new-variable"
        >
          <div className="modal__header">
            <button
                className="lnr lnr-cross modal__close-btn"
                type="button"
                onClick={()=>setSuccessModal(false)}
            />
          </div>
          <div className="modal__body">
            <CustomAlert
                color="success"
                className="alert--bordered"
                icon>
              <p>
                <span className="bold-text">Variable was shared successful!</span>
              </p>
            </CustomAlert>
          </div>
        </Modal>
        {/*{renderContent()}*/}
      </Container>
    </Row>
  );
};

FormShareVariable = reduxForm({
  form: 'share_form_variable',
  validate,
})(FormShareVariable);

const selector = formValueSelector('share_form_variable');

FormShareVariable = connect((state) => {
  const select = selector(state, 'select');
  return {
    select,
  };
})(FormShareVariable);

export default FormShareVariable;
