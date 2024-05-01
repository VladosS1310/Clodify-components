import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal, Spinner } from 'reactstrap';
import validate from '../FormAddNewVariable/validate';
import CustomAlert from '../../../../../../../shared/components/customComponents/CustomAlert/CustomAlert';


const renderField = ({
  input,
  placeholder,
  type,
  meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
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

const FormEditVariable = (props) => {
  const { variable, initialize, handleSubmit, modal, toggle, loading, errors } =
    props;

  useEffect(() => {
    initialize(variable);
  }, [initialize, variable]);

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      modalClassName="ltr-support"
      className="modal-dialog--primary theme-light"
    >
      <div className="modal__header" data-testid="edit-modal">
        <button
          className="lnr lnr-cross modal__close-btn"
          type="button"
          onClick={() => toggle()}
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
            <span className="form__form-group-label">Name</span>
            <div className="form__form-group-field">
              <Field name="name" component={renderField} type="text" />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Value</span>
            <div className="form__form-group-field">
              <Field name="value" component={renderField} type="text" />
            </div>
          </div>
          <ButtonToolbar className="form__button-toolbar">
            <Button color="primary" type="submit">
              Save
            </Button>
            <Button type="button" onClick={() => toggle()}>
              Cancel
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
  form: 'edit_form_variable', // a unique identifier for this form
  validate,
})(FormEditVariable);
