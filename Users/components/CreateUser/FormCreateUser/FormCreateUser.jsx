import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderSelectField from '../../../../../../shared/components/form/Select';
import validate from './validate';
import {renderField} from '../../../../../../utils/helpers';


const FormCreateUser = ({handleSubmit}) => {
  const userRoles = [
    {id: "ADMIN", label: "ADMIN"},
    {id: "FIN", label: "FIN"},
    {id: "DEV", label: "DEV"},
    {id: "CLIENT", label: "CLIENT"},
    {id: "SALES", label: "SALES"},
    {id: "PM", label: "PM"}
  ]

  const employment = [
    {id: "GENERAL", label: "GENERAL"},
    {id: "INHOUSE", label: "INHOUSE"},
    {id: "TM", label: "TM"},
  ]

  return (
    <Card>
      <CardBody className="card-body-adaptive">
        <form className='form form-add-user' onSubmit={handleSubmit}>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>First Name</span>
              <div className='form__form-group-field'>
                <Field
                  name='first_name'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Last Name</span>
              <div className='form__form-group-field'>
                <Field
                  name='last_name'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Middle Name</span>
              <div className='form__form-group-field'>
                <Field
                  name='middle_name'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Company</span>
              <div className='form__form-group-field'>
                <Field
                  name='company'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Salary</span>
              <div className='form__form-group-field'>
                <Field
                  name='salary'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Official Salary</span>
              <div className='form__form-group-field'>
                <Field
                  name='official_salary'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className="form__form-group">
              <span className="form__form-group-label">User Roles</span>
              <div className="form__form-group-field">
                <Field
                  name="selectRoles"
                  component={renderSelectField}
                  id="user_role"
                  value={"All Roles"}
                  options={[{id: '', label: "All Roles"}, ...userRoles || []]?.map(u => {
                    return {
                      value: u.id,
                      label: u.label
                    }
                  })}
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Employment</span>
              <div className='form__form-group-field'>
                <Field
                  name="selectEmployment"
                  component={renderSelectField}
                  id="type"
                  options={employment?.map(u => {
                    return {
                      value: u.id,
                      label: u.label
                    }
                  })}
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Email</span>
              <div className='form__form-group-field'>
                <Field
                  name='email'
                  component={renderField}
                  type="input"
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Slack Username</span>
              <div className='form__form-group-field d-flex align-items-center'>
                <Field
                  name='slack_username'
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Phone</span>
              <div className='form__form-group-field d-flex align-items-center'>
                <Field
                  name='phone'
                  component={renderField}
                  type='input'
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
  form: 'formCreateUser',
  validate
})(FormCreateUser);