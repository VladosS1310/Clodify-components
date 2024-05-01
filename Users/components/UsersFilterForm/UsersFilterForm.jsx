import React from 'react';
import { Button, Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderSelectField from '../../../../../shared/components/form/Select';


const renderField = ({ input, label, type, meta: { touched, error, warning }, disabled }) => (
  <div style={{ width: "100%" }}>
    <div style={{ width: "100%" }}>
      <input {...input} placeholder={label} type={type} disabled={disabled} style={{ height: "38px", backgroundColor: "white" }} />
      {touched && ((error && <span style={{ color: 'red' }}>*{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
)

const UsersFilterForm = ({handleSubmit, resetForm, reset, userRole}) => {
  const userRoles = [
    {id: "ADMIN", label: "ADMIN"},
    {id: "FIN", label: "FIN"},
    {id: "DEV", label: "DEV"},
    {id: "CLIENT", label: "CLIENT"},
    {id: "SALES", label: "SALES"},
    {id: "PM", label: "PM"},
    {id: "GUEST", label: "GUEST"}
  ]

  const userStatus = [
    {id: 1, label: "Active"},
    {id: 0, label: "Inactive"},
  ]

  return (
    <form  onSubmit={handleSubmit} className="form w-100 form_UsersFilter">
      <Col sm={userRole === "FIN" || userRole === "SALES" || userRole === "ADMIN" ? 6 : 12}>
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
      {
        userRole === "FIN" || userRole === "SALES" || userRole === "ADMIN" ? (
          <Col sm={3}>
            <div className="form__form-group">
              <span className="form__form-group-label">User Status</span>
              <div className="form__form-group-field">
                <Field
                  name="selectStatus"
                  component={renderSelectField}
                  id="users_status"
                  value={"All Users"}
                  options={[{id: '', label: "All Users"}, ...userStatus || []]?.map(u => {
                    return {
                      value: u.id,
                      label: u.label
                    }
                  })}
                />
              </div>
            </div>
          </Col>
        ) : null
      }
      {
        userRole === "FIN" || userRole === "SALES" || userRole === "ADMIN" ? (
          <Col sm={3}>
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
        ) : null
      }

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
  form: 'users_filter_form',
})(UsersFilterForm);