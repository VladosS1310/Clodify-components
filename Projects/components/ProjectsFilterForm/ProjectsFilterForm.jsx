import React from 'react';
import { Button, Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';


const renderField = ({ input, label, type, meta: { touched, error, warning }, disabled }) => (
  <div style={{ width: "100%" }}>
    <div style={{ width: "100%" }}>
      <input {...input} placeholder={label} type={type} disabled={disabled} style={{ height: "38px", backgroundColor: "white" }} />
      {touched && ((error && <span style={{ color: 'red' }}>*{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)

const ProjectsFilterForm = ({handleSubmit, resetForm, reset}) => {
  return (
    <form  onSubmit={handleSubmit} className="form w-100 form_UsersFilter">
      <Col sm={12}>
        <div className="form__form-group">
          <span className="form__form-group-label">Search Query</span>
          <div className="form__form-group-field">
            <Field
              name="search"
              component={renderField}
              type="text"
              label={"Search..."}
            />
          </div>
        </div>
      </Col>
      <Col sm={12}>
        <div className="form_users-filter-buttons">
          <Button type="button" color="outline-secondary" onClick={() => { resetForm(); reset() }}>
            Clear Filters
          </Button>
          <Button type="submit" color="primary">
            Apply Filters
          </Button>
        </div>
      </Col>
    </form>
  );
};

export default reduxForm({
  form: 'projects_filter_form',
})(ProjectsFilterForm);