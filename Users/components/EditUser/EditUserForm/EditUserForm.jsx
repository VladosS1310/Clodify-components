import React from 'react';
import { Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderSelectField from '../../../../../../shared/components/form/Select';
import { connect } from 'react-redux';
import validate from "./validate";
import {renderField} from '../../../../../../utils/helpers';


let EditUserForm = ({handleSubmit}) => {
  const userRoles = [
    {id: "ADMIN", label: "ADMIN"},
    {id: "FIN", label: "FIN"},
    {id: "DEV", label: "DEV"},
    {id: "CLIENT", label: "CLIENT"},
    {id: "SALES", label: "SALES"},
    {id: "PM", label: "PM"}
  ]

  const authTypes = [
    {id: 1, label: "Crowd"},
    {id: 2, label: "Local"},
  ]


  const employment = [
    {id: "GENERAL", label: "GENERAL"},
    {id: "INHOUSE", label: "INHOUSE"},
    {id: "TM", label: "TM"},
  ]

  return (
    <div className='card'>
      <div className='card-body card-body-adaptive'>
        <Col className="col-12">
          <h5 className='mb-2'>EDIT DETAILS</h5>
        </Col>
        <form className='form form-edit-invoice' onSubmit={handleSubmit}>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>First Name</span>
              <div className='form__form-group-field'>
                <Field
                  name='first_name'
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Last Name</span>
              <div className='form__form-group-field'>
                <Field
                  name="last_name"
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Middle Name</span>
              <div className='form__form-group-field'>
                <Field
                  name="middle_name"
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Company</span>
              <div className='form__form-group-field'>
                <Field
                  name="company"
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Salary</span>
              <div className='form__form-group-field'>
                <span className="d-flex align-items-center" style={{fontSize: "16px", paddingRight: "5px"}}>$</span>
                <Field
                  name="salary"
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Official Salary</span>
              <div className='form__form-group-field d-flex align-items-center'>
                <Field
                  name='official_salary'
                  component={renderField}
                  type='input'
                />
              </div>
            </div>
          </Col>
          <Col className="col-12">
            <div className='form__form-group'>
              <span className='form__form-group-label'>Password</span>
              <div className='form__form-group-field d-flex align-items-center'>
                <Field
                  name='password'
                  component={renderField}
                  type='input'
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
                  options={userRoles?.map(u => {
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
              <div className='form__form-group-field d-flex align-items-center'>
                <Field
                  name='email'
                  component={renderField}
                  type='input'
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
          <Col className="col-12">
            <div className="form__form-group">
              <span className="form__form-group-label">Auth Type</span>
              <div className="form__form-group-field">
                <Field
                  name="selectAuthType"
                  component={renderSelectField}
                  id="auth_type"
                  options={authTypes?.map(u => {
                    return {
                      value: u.id,
                      label: u.label
                    }
                  })}
                />
              </div>
            </div>
          </Col>
          <Col sm={12} className='d-flex justify-content-end w-100'>
            <button type='submit' className='btn btn-primary'>Save</button>
          </Col>
        </form>
      </div>
    </div>
  );
};

EditUserForm = reduxForm({
  form: 'editUserForm',
  validate
})(EditUserForm);

EditUserForm = connect(
  state => {
    return {
      initialValues: {
        ...state.editUser.editUser,
        selectRoles: {
          value: state?.editUser?.editUser?.role,
          label: state?.editUser?.editUser?.role
        },
        selectAuthType: {
          value: state?.editUser?.editUser?.auth_type,
          label: state?.editUser?.editUser?.auth_type === 2 ? 'Local' : 'Crowd'
        },
        selectEmployment: {
          value: state?.editUser?.editUser?.employment,
          label: state?.editUser?.editUser?.employment
        }
      },
      enableReinitialize: true,
    }
  })(EditUserForm)

export default EditUserForm;