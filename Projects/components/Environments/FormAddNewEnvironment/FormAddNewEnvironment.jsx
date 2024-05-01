import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal, Spinner } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import validate from './validate';
import CustomAlert from '../../../../../../shared/components/customComponents/CustomAlert/CustomAlert';
import { renderField } from '../../../../../../utils/helpers';


const FormAddNewEnvironment = ({
  handleSubmit,
  modal,
  toggle,
  errors,
  loading,
}) => {
  const { t } = useTranslation('common');

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      modalClassName="ltr-support"
      className="modal-dialog--primary theme-light"
    >
      <div className="modal__header">
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
              <Field name="roles" component={renderField} type="text" />
            </div>
          </div>
          <ButtonToolbar className="d-flex justify-content-end w-100">
            <Button color="primary" type="submit">
              {t('environment.form_add_new_environment.tittle_button_submit')}
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
  form: 'add_new_environment',
  validate,
})(FormAddNewEnvironment);
