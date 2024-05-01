import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Card, CardBody, Col } from 'reactstrap';
import renderSelectField from '../../../../../../../shared/components/form/Select';
import validate from "./validate";
import renderDatePickerField from '../../../../../../../shared/components/form/DatePicker';
import { renderField } from '../../../../../../../utils/helpers';


const FormCreateWorkHistory = ({handleSubmit}) => {
  const type = [
    {id: "Epic Fails", label: "Epic Fails"},
    {id: "Fails", label: "Fails"},
    {id: "Efforts", label: "Efforts"},
    {id: "Benefits", label: "Benefits"},
    {id: "Public", label: "Public"}
  ]

  return (
    <Card>
      <CardBody className="card-body-adaptive">
        <form className='form form-add-user' onSubmit={handleSubmit}>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Title</span>
              <div className='form__form-group-field'>
                <Field
                  name='title'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className="form__form-group">
              <span className="form__form-group-label">Date Start</span>
              <div className="form__form-group-field">
                <Field
                  name="date_start"
                  component={renderDatePickerField}
                  maxDate={new Date()}
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className="form__form-group">
              <span className="form__form-group-label">Date End</span>
              <div className="form__form-group-field">
                <Field
                  name="date_end"
                  component={renderDatePickerField}
                  maxDate={new Date()}
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Type</span>
              <div className='form__form-group-field'>
                <Field
                  name="selectType"
                  component={renderSelectField}
                  id="type"
                  options={type?.map(u => {
                    return {
                      value: u.id,
                      label: u.label
                    }
                  })}
                />
              </div>
            </div>
          </Col>
          <Col sm={12} className='d-flex justify-content-end'>
            <button type="submit" className='btn btn-primary'>Save</button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};

export default reduxForm({
  form: 'formCreateWorkHistory',
  initialValues: {
    date_start: new Date(),
    date_end: new Date()
  },
  validate
})(FormCreateWorkHistory);