import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal, Spinner } from 'reactstrap';
import validate from './validate';
import CustomAlert from '../../../../../../shared/components/customComponents/CustomAlert/CustomAlert';
import { renderField } from '../../../../../../utils/helpers';


const FormEditEnvironment = (props) => {
  const { data, initialize, modal, toggle, handleSubmit, errors, loading } =
    props;
  const { t } = useTranslation('common');

  useEffect(() => {
    initialize(data);
  }, [data, initialize]);

  return (
    <Modal
      isOpen={!!modal}
      toggle={toggle}
      modalClassName="ltr-support"
      className="modal-dialog--primary theme-light"
    >
      <div className="modal__header" data-testid="edit-modal">
        <button
          className="lnr lnr-cross modal__close-btn"
          type="button"
          onClick={toggle}
        />
      </div>
      <div className="modal__body">
        {errors.length > 0 &&
          errors.map((error, i) => {
            return (
              <CustomAlert color="danger" className="alert--bordered" icon key={i}>
                <p>
                  <span className="bold-text">{error.param}</span>{' '}
                  {error.message}
                </p>
              </CustomAlert>
            );
          })}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__form-group">
            <span className="form__form-group-label">
              {t('environment.form_add_new_environment.title_input_branch')}
            </span>
            <div className="form__form-group-field">
              <Field
                name="branch"
                component={renderField}
                type="text"
                placeholder="staging/master"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">
              {t('environment.form_add_new_environment.title_input_roles')}
            </span>
            <div className="form__form-group-field">
              <Field
                name="access_roles"
                component={renderField}
                type="text"
                placeholder="PM"
              />
            </div>
          </div>
          <ButtonToolbar className="form__button-toolbar w-100 d-flex justify-content-between">
            <Button type="button" onClick={() => toggle()} className="mr-0" style={{width: "47%"}}>
              Cancel
            </Button>
            <Button color="primary" type="submit" style={{width: "47%"}}>
              Save
            </Button>
            {loading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </ButtonToolbar>
        </form>
      </div>
    </Modal>
  );
};

export default reduxForm({
  form: 'edit_environment',
  validate,
})(FormEditEnvironment);
