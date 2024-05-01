import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Card, CardBody, Col, Row } from 'reactstrap';
import renderSelectField, { SelectField } from '../../../../../../shared/components/form/Select';
import _ from "lodash";
import { getUsers } from '../../../../../../utils/api';
import DeleteIcon from 'mdi-react/DeleteIcon';
import {renderField} from '../../../../../../utils/helpers';
import renderRadioButtonField from '../../../../../../shared/components/form/RadioButton';
import Roles from '../../../../../../config/roles'
import renderCheckBoxField from '../../../../../../shared/components/form/CheckBox';
import renderDatePickerField from '../../../../../../shared/components/form/DatePicker';

const ProjectsAddForm = ({onSubmit}) => {
  let data = JSON.parse(localStorage.getItem("storage:user"));
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([{}])
  const fullCustomers = _.xorBy(customers, _.map(_.filter(users, {role: "CLIENT"}), u => ({id: u.id, label: u.first_name + ' ' + u.last_name })), "id");
  const [radioValue, setRadioValue] = useState('HOURLY');
  const [developers, setDevelopers] = useState([{}]);
  const fullDevelopers = _.xorBy(developers, _.map(_.filter(users, (u) => (u.role !== "CLIENT")), u => ({id: u.id, label: u.first_name + ' ' + u.last_name })), "id");
  const sales = _.flatten(_.map(_.filter(users, _ => _ && typeof _ === 'object' && (_.role === 'SALES' || _.role === 'ADMIN')), function(item) {
    return _.filter(developers, (d) => (d.id === item.id));
  }));
  const pm = _.flatten(_.map(_.filter(users, _ => _ && typeof _ === 'object' && (_.role === 'PM')), function(item) {
    return _.filter(developers, (d) => (d.id === item.id));
  }));
  const [formSubmissionErrors, setFormSubmissionErrors] = useState({});

  useEffect(() => {
    getUsers({limit: "9999", is_active: 1}).then(res => {
      setUsers(res.data.data.users);
    })
  }, []);

  const projectsStatus = [
    {id: "NEW", label: "New"},
    {id: "ONHOLD", label: "On Hold"},
    {id: "INPROGRESS", label: "In Progress"},
    {id: "DONE", label: "Done"},
    {id: "CANCELLED", label: "Cancelled"}
  ]

  const handleSubmitMain = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    const emptyFields = Object.keys(formProps).filter((key) => {
      let value;
      if (key !== "selectAlias" && key !== "date_end") {
        value = formProps[key];
      }

      return typeof value === 'string' && value.trim() === '';
    });

    if (emptyFields.length > 0) {
      const errors = emptyFields.reduce((acc, field) => {
        acc[field] = !field.includes("select") ? `*${(field === 'project_name' && 'Project Name field') || (field === 'jira_code' && 'Jira code field')} shouldn’t be empty` : '*Please select the option';

        return acc;
      }, {});

      setFormSubmissionErrors(errors);
      return;
    }

    onSubmit({
      ...formProps,
      customers: _.map(customers, (c) => (c.id)),
      developers: _.map(_.filter(developers, (d) => d.id || d.alias), (d) => ({id: d.id, alias: d.alias}))
    })
  }


  return (
    <Card>
      <CardBody>
        <form className="form" onSubmit={handleSubmitMain}>
          <Row>
            <Col className="col-12">
              <div className="form__form-group">
                <span className="form__form-group-label">Project Name</span>
                <div className='form__form-group-field'>
                  <Field
                    name='project_name'
                    component={renderField}
                    type='text'
                  />
                </div>
                {!_.isEmpty(formSubmissionErrors.project_name) && (<span className={"form__form-group-error"}>{formSubmissionErrors.project_name}</span>)}
              </div>
            </Col>
            {
              data.role === Roles.ADMIN && (
                <Col className='col-12'>
                  <div className='form__form-group'>
                    <div className='form__form-group-field'>
                      <Field
                        name='is_internal'
                        component={renderCheckBoxField}
                        label='Tick if this is internal project'
                      />
                    </div>
                  </div>
                </Col>
              )
            }
            <Col className='col-4'>
              <div className='form__form-group'>
                <span className='form__form-group-label'>Jira</span>
                <div className='form__form-group-field'>
                  <Field
                    name="jira_code"
                    component={renderField}
                    type="text"
                  />
                </div>
                {!_.isEmpty(formSubmissionErrors.jira_code) && (<span className={"form__form-group-error"}>{formSubmissionErrors.jira_code}</span>)}
              </div>
            </Col>
            <Col className="col-4">
              <div className="form__form-group">
                <span className="form__form-group-label">Date Start</span>
                <div className="form__form-group-field">
                  <Field
                    name="date_start"
                    component={renderDatePickerField}
                  />
                </div>
              </div>
            </Col>
            <Col className="col-4">
              <div className="form__form-group">
                <span className="form__form-group-label">Date End</span>
                <div className="form__form-group-field">
                  <Field
                    name="date_end"
                    component={renderDatePickerField}
                  />
                </div>
              </div>
            </Col>
            <Col className="col-12">
              <div className="form__form-group">
                <span className="form__form-group-label">Status</span>
                <div className="form__form-group-field">
                  <Field
                    name="selectStatus"
                    component={renderSelectField}
                    id="status"
                    options={projectsStatus?.map(u => {
                      return {
                        value: u.id,
                        label: u.label
                      }
                    })}
                  />
                </div>
                {!_.isEmpty(formSubmissionErrors.selectStatus) && (<span className={"form__form-group-error"}>{formSubmissionErrors.selectStatus}</span>)}
              </div>
            </Col>
            <Col sm={6}>
              <div className="form__form-group d-flex">
                <span className="form__form-group-label" style={{padding: "5px 10px 0 0"}}>Hourly</span>
                <div className="form__form-group-field">
                  <Field
                    name="type"
                    component={renderRadioButtonField}
                    onChange={(val) => setRadioValue(val)}
                    radioValue="HOURLY"
                    defaultChecked
                  />
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <div className="form__form-group d-flex">
                <span className="form__form-group-label" style={{whiteSpace: "nowrap", padding: "5px 10px 0 0"}}>Fixed Price</span>
                <div className="form__form-group-field">
                  <Field
                    name="type"
                    component={renderRadioButtonField}
                    onChange={(val) => setRadioValue(val)}
                    radioValue="FIXED_PRICE"
                  />
                </div>
              </div>
            </Col>
            {
              radioValue !== "HOURLY" ? (
                <>
                  <Col className="col-12">
                    <h4>Milestones</h4>
                  </Col>
                  <Col className="col-12" sm={6} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Name</span>
                      <div className="form__form-group-field">
                        <Field
                          name="milestones_name"
                          component={renderField}
                          type="text"
                        />
                      </div>
                      {!_.isEmpty(formSubmissionErrors.milestones_name) && (<span className={"form__form-group-error"}>{formSubmissionErrors.milestones_name}</span>)}
                    </div>
                  </Col>
                  <Col className="col-12" sm={6} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Start Date</span>
                      <div className="form__form-group-field">
                        <Field
                          name="start_date"
                          component={renderField}
                          type="date"
                        />
                      </div>
                      {!_.isEmpty(formSubmissionErrors.start_date) && (<span className={"form__form-group-error"}>{formSubmissionErrors.start_date}</span>)}
                    </div>
                  </Col>
                  <Col className="col-12" sm={6} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">End Date</span>
                      <div className="form__form-group-field">
                        <Field
                          name="end_date"
                          component={renderField}
                          type="date"
                        />
                      </div>
                      {!_.isEmpty(formSubmissionErrors.end_date) && (<span className={"form__form-group-error"}>{formSubmissionErrors.end_date}</span>)}
                    </div>
                  </Col>
                  <Col className="col-12" sm={6} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Estimated Amount</span>
                      <div className="form__form-group-field">
                        <Field
                          name="estimated_amount"
                          component={renderField}
                          type="text"
                        />
                      </div>
                      {!_.isEmpty(formSubmissionErrors.estimated_amount) && (<span className={"form__form-group-error"}>{formSubmissionErrors.estimated_amount}</span>)}
                    </div>
                  </Col>
                </>
              ) : null
            }
            <Col className="col-12">
              <h4>Customers</h4>
            </Col>
            {
              _.map(customers, (c, i) => {
                return (
                  <>
                    <Col className="col-10">
                      <div className="form__form-group">
                        {
                          !i ? (<span className="form__form-group-label">Customers</span>) : null
                        }
                        <div className="form__form-group-field">
                          <div className={`form__form-group-input-wrap`}>
                            <SelectField
                              name="selectCustomers"
                              value={ {value: c.id, label: c.label} }
                              onChange={({ value, label }) => {
                                const newState = [...customers];
                                newState[i] = {id: value, label}

                                setCustomers(newState);
                              }}
                              options={fullCustomers?.map(u => {
                                return {
                                  value: u.id,
                                  label: u.label
                                }
                              })}
                            />
                          </div>
                        </div>
                        {!_.isEmpty(formSubmissionErrors.selectCustomers) && (<span className={"form__form-group-error"}>{formSubmissionErrors.selectCustomers}</span>)}
                      </div>
                    </Col>
                    <Col sm={2}>
                      {
                        customers.length > 1 ? (<button
                            type="button"
                            style={{ border: 0, background: 'transparent', marginTop: `${!i ? "32px" : "7px"}` }}>
                            <DeleteIcon
                              color="#b1c3c8"
                              size={22}
                              onClick={() => setCustomers(_.filter(customers, (_c, _i) => _i !== i))}
                            />
                          </button>
                          ) : null
                      }
                    </Col>
                  </>
                )
              })
            }
            <Col sm={12}>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setCustomers([...customers, {}])}
                style={{fontSize: "24px", color: "#fff", padding: "5px 10px", lineHeight: "22px", borderRadius: "50%"}}
              >+</button>
            </Col>
            <Col className="col-12">
              <h4>Developers</h4>
            </Col>
            {
              _.map(developers, (c, i) => {
                return (
                  <>
                    <Col className="col-5">
                      <div className="form__form-group">
                        {
                          !i ? (<span className="form__form-group-label">Developers</span>) : null
                        }
                        <div className="form__form-group-field">
                          <div className={`form__form-group-input-wrap`}>
                            <SelectField
                              name="selectDevelopers"
                              value={ {value: c.id, label: c.label} }
                              onChange={({ value, label }) => {
                                const newState = [...developers];
                                newState[i] = {...newState[i], id: value, label}

                                setDevelopers(newState);
                              }}
                              options={fullDevelopers?.map(u => {
                                return {
                                  value: u.id,
                                  label: u.label
                                }
                              })}
                            />
                          </div>
                        </div>
                        {!_.isEmpty(formSubmissionErrors.selectDevelopers) && (<span className={"form__form-group-error"}>{formSubmissionErrors.selectDevelopers}</span>)}
                      </div>
                    </Col>
                    <Col className="col-5">
                      <div className="form__form-group">
                        {
                          !i ? (<span className="form__form-group-label">Alias</span>) : null
                        }
                        <div className="form__form-group-field">
                          <SelectField
                            name="selectAlias"
                            value={ {value: c.alias, label: c.aliasLabel} }
                            onChange={({ id, label }) => {
                              const newState = [...developers];
                              newState[i] = {...newState[i], alias: id, aliasLabel: label}

                              setDevelopers(newState);
                            }}
                            options={fullDevelopers}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={2}>
                      {
                        developers.length > 1 ? (<button
                            type="button"
                            style={{ border: 0, background: 'transparent', marginTop: `${!i ? "32px" : "7px"}` }}>
                            <DeleteIcon
                              color="#b1c3c8"
                              size={22}
                              onClick={() => setDevelopers(_.filter(developers, (_c, _i) => _i !== i))}
                            />
                          </button>
                          ) : null
                      }
                    </Col>
                  </>
                )
              })
            }
            <Col sm={12}>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setDevelopers([...developers, {}])}
                style={{fontSize: "24px", color: "#fff", padding: "5px 10px", lineHeight: "22px", borderRadius: "50%"}}
              >+</button>
            </Col>
            <Col className="col-12">
              <div className="form__form-group">
                <span className="form__form-group-label">Invoice Receiver</span>
                <div className="form__form-group-field">
                  <Field
                    name="selectInvoiceReceiver"
                    component={renderSelectField}
                    options={customers?.map(u => {
                      return {
                        value: u.id,
                        label: u.label
                      }
                    })}
                  />
                </div>
                {!_.isEmpty(formSubmissionErrors.selectInvoiceReceiver) && (<span className={"form__form-group-error"}>{formSubmissionErrors.selectInvoiceReceiver}</span>)}
              </div>
            </Col>
            <Col className="col-12">
              <div className="form__form-group">
                <span className="form__form-group-label">Sales</span>
                <div className="form__form-group-field">
                  <Field
                    name="selectSales"
                    component={renderSelectField}
                    options={sales?.map(u => {
                      return {
                        value: u.id,
                        label: u.label
                      }
                    })}
                  />
                </div>
                {!_.isEmpty(formSubmissionErrors.selectSales) && (<span className={"form__form-group-error"}>{formSubmissionErrors.selectSales}</span>)}
              </div>
            </Col>
            <Col className="col-12">
              <div className="form__form-group">
                <span className="form__form-group-label">PM</span>
                <div className="form__form-group-field">
                  <Field
                    name="selectPM"
                    component={renderSelectField}
                    options={pm?.map(u => {
                      return {
                        value: u.id,
                        label: u.label
                      }
                    })}
                  />
                </div>
                {!_.isEmpty(formSubmissionErrors.selectPM) && (<span className={"form__form-group-error"}>{formSubmissionErrors.selectPM}</span>)}
              </div>
            </Col>
            <Col className="col-12">
              <ButtonToolbar className="form__button-toolbar d-flex w-100 justify-content-end">
                <Button color="primary" type="submit">Save</Button>
              </ButtonToolbar>
            </Col>
          </Row>
          </form>
      </CardBody>
    </Card>
  );
};

export default reduxForm({
  form: 'projects_add_form',
  initialValues: {
    is_internal: true,
    date_start: new Date(),
    type: "HOURLY"
  }
})(ProjectsAddForm);