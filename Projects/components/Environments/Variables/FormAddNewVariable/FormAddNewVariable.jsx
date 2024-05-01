import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonToolbar, Modal, Spinner } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import validate from './validate';
import CustomAlert from '../../../../../../../shared/components/customComponents/CustomAlert/CustomAlert';


const renderField = ({
  input,
  placeholder,
  type,
  meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
    <input
      {...input}
      placeholder={placeholder}
      type={type}
      onChange={(e) => {
        // Remove whitespaces when pasting values
        e.preventDefault();

        const { target, nativeEvent } = e;
        const { value } = target;
        let result = value;

        if (nativeEvent.inputType === 'insertFromPaste') {
          result = value.trim();
        }

        input.onChange(result);
      }}
    />
    {touched && error && (
      <span className="form__form-group-error">{error}</span>
    )}
  </div>
);

renderField.defaultProps = {
  placeholder: '',
  meta: null,
  type: 'text',
};

const FormAddNewVariable = (props) => {
  const { modal, toggle, handleSubmit, mesErrors, loading } = props;
  const { t } = useTranslation('common');

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      modalClassName="ltr-support"
      className="modal-dialog--primary theme-light modal-add-new-variable"
    >
      <div className="modal__header">
        <button
          className="lnr lnr-cross modal__close-btn"
          type="button"
          onClick={toggle}
        />
      </div>
      <div className="modal__body">
        {mesErrors.length > 0 &&
          mesErrors.map((error, i) => {
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
              {t('variables.form_add_new_variable.title_input_key')}
            </span>
            <div className="form__form-group-field">
              <Field
                name="key"
                component={renderField}
                type="text"
                placeholder="Enter var key"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">
              {t('variables.form_add_new_variable.title_input_value')}
            </span>
            <div className="form__form-group-field">
              <Field
                name="value"
                component={renderField}
                type="text"
                placeholder="Enter var value"
              />
            </div>
          </div>
          <ButtonToolbar>
            <Button color="primary" type="submit">
              {t('variables.form_add_new_variable.tittle_button_submit')}
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
  form: 'add_new_variable',
  validate,
})(FormAddNewVariable);
