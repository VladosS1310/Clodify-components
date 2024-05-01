import React from 'react';
import { Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import validate from './validate';
import {renderField} from '../../../../../../utils/helpers';


const ProjectEditMonitoringForm = ({handleSubmit}) => {
  return (
    <form  onSubmit={handleSubmit} className="form w-100">
      <Col className={"col-12"}>
        <div className="form__form-group">
          <span className="form__form-group-label">URL</span>
          <div className="form__form-group-field">
            <Field
              name="url"
              component={renderField}
              type="text"
            />
          </div>
        </div>
      </Col>
      <Col className={"col-12"}>
        <div className="form__form-group">
          <span className="form__form-group-label">Notification Emails</span>
          <div className="form__form-group-field">
            <Field
              name="notification_emails"
              component={renderField}
              type="text"
            />
          </div>
        </div>
      </Col>
      <Col className="d-flex justify-content-end col-12">
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </Col>
    </form>
  );
};

export default reduxForm({
  form: 'project_edit_monitoring_form',
  validate
})(ProjectEditMonitoringForm);