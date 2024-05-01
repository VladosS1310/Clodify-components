import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Col, Row } from 'reactstrap';
import renderSelectField, { SelectField } from '../../../../../../shared/components/form/Select';
import _ from "lodash";
import DeleteIcon from 'mdi-react/DeleteIcon';
import { connect, useSelector } from 'react-redux';
import DataReactTable from '../../../../../Tables/DataTable/components/DataReactTable';
import { columns } from './DataReactTableColumns';
import ConfirmModal from '../../../../../../shared/components/customComponents/CustomConfirmModal/ConfirmModal';
import CustomModal from '../../../../../../shared/components/customComponents/CustomModal/CustomModal';
import { putProjectMilestones } from '../../../../../../utils/api';
import { useParams } from 'react-router-dom';
import {renderField} from '../../../../../../utils/helpers';
import renderRadioButtonField from '../../../../../../shared/components/form/RadioButton';
import renderCheckBoxField from '../../../../../../shared/components/form/CheckBox';
import Roles from "../../../../../../config/roles"
import renderDatePickerField from '../../../../../../shared/components/form/DatePicker';
import moment from 'moment';


let ProjectsEditForm = ({onSubmit}) => {
  let data = JSON.parse(localStorage.getItem("storage:user"));
  const { editProject } = useSelector(state => state.editProjects);
  const { users } = useSelector(state => state.users);
  const params = useParams();
  const [customers, setCustomers] = useState([{}]);
  const fullCustomers = _.xorBy(customers, _.map(_.filter(users, {role: "CLIENT"}), u => ({id: u.id, label: u.first_name + ' ' + u.last_name })), "id");
  const [developers, setDevelopers] = useState([{}]);
  const [selectedSale, setSelectedSale] = useState({});
  const [selectedPM, setSelectedPM] = useState({});
  const [selectedInvoiceReceiver, setSelectedInvoiceReceiver] = useState({});
  const fullDevelopers = _.xorBy(developers, _.map(_.filter(users, (u) => (u.role !== "CLIENT")), u => ({id: u.id, label: u.first_name + ' ' + u.last_name })), "id");
  const sales = _.flatten(_.map(_.filter(users, _ => _ && typeof _ === 'object' && (_.role === 'SALES' || _.role === 'ADMIN')), function(item) {
    return _.filter(developers, (d) => (d.id === item.id));
  }));
  const pm = _.flatten(_.map(_.filter(users, _ => _ && typeof _ === 'object' && (_.role === 'PM')), function(item) {
    return _.filter(developers, (d) => (d.id === item.id));
  }));
  const objectPM = _.find(developers, {id: selectedPM?.value});
  const objectSales = _.find(developers, {id: selectedSale?.value});
  const objectInvoiceReceiver = _.find(customers, {id: selectedInvoiceReceiver?.value});
  const [confirmCloseMilestoneModal, setConfirmCloseMilestoneModal] = useState(false);
  const [failedCloseMilestoneModal, setFailedCloseMilestoneModal] = useState(false);
  const [messageCloseMilestoneError, setMessageCloseMilestoneError] = useState(false);
  const [successCloseMilestoneModal, setSuccessCloseMilestoneModal] = useState(false);

  useEffect(() => {
    if(objectPM) return;

    setSelectedPM({id: null, label: ''});
  }, [objectPM]);

  useEffect(() => {
    if(objectSales) return;

    setSelectedSale({id: null, label: ''});
  }, [objectSales]);

  useEffect(() => {
    if(objectInvoiceReceiver) return;

    setSelectedInvoiceReceiver({id: null, label: ''});
  }, [objectInvoiceReceiver]);

  useEffect(() => {
    if(!editProject[0]?.clients.length) return;

    setCustomers(_.map(editProject[0]?.clients, (c) => ({id: c.id, label: c.first_name + ' ' + c.last_name})));
  }, [editProject]);

  useEffect(() => {
    if(!editProject[0]?.developers.length) return;

    setDevelopers(_.map(editProject[0]?.developers, (c) => ({
      id: c?.id,
      label: c?.first_name + ' ' + c?.last_name,
      alias: c.alias ? c?.alias?.id : null,
      aliasLabel: c.alias ? c?.alias?.first_name + ' ' + c?.alias?.last_name : null
    })));
  }, [editProject])

  useEffect(() => {
    const objectPM = _.find(users, {id: editProject[0]?.is_pm});
    const objectSales = _.find(users, {id: editProject[0]?.is_sales});
    const objectInvoiceReceiver = _.find(editProject[0]?.clients, (c) => c.receive_invoices === 1);

    setSelectedSale({
      value: editProject[0]?.is_sales,
      label: objectSales?.first_name + ' ' + objectSales?.last_name
    });
    setSelectedPM({
      value: editProject[0]?.is_pm,
      label: objectPM?.first_name + ' ' + objectPM?.last_name
    });
    setSelectedInvoiceReceiver({
      value: objectInvoiceReceiver?.id,
      label: objectInvoiceReceiver?.first_name + ' ' + objectInvoiceReceiver?.last_name
    })
  }, [editProject, users]);

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

    onSubmit({
      ...formProps,
      customers: _.map(customers, (c) => (c.id)),
      developers: _.map(_.filter(developers, (d) => d.id || d.alias), (d) => ({id: d.id, alias: d.alias})),
      invoice_received: selectedInvoiceReceiver?.value || selectedInvoiceReceiver?.id,
      is_sales: selectedSale?.value || selectedSale?.id,
      is_pm: selectedPM?.value || selectedPM?.id,
      date_start: moment(new Date(formProps.date_start.split("/").reverse().join('-'))).format('YYYY-MM-DD'),
      date_end: moment(new Date(formProps.date_end.split("/").reverse().join('-'))).format('YYYY-MM-DD'),
    })
  }

  const handleCloseMilestone = () => {
    putProjectMilestones(params.id).then(res => {
      if(res.data.success) {
        setSuccessCloseMilestoneModal(!successCloseMilestoneModal);
      } else {
        setMessageCloseMilestoneError(res.data.errors[0].message);
        setFailedCloseMilestoneModal(!failedCloseMilestoneModal);
      }
    })
  }

  const checkHiddenColumns = () => {
    if(editProject[0]?.milestones[0]?.status === "CLOSED") {
      return ['actions'];
    }

    return [];
  }

  return (
    <form className="form" onSubmit={handleSubmitMain}>
      <Row>
        <Col className="col-12">
          <div className="form__form-group">
            <span className="form__form-group-label">Project Name</span>
            <div className="form__form-group-field">
              <Field
                name="project_name"
                component={renderField}
                type="text"
              />
            </div>
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
        <Col className="col-4">
          <div className="form__form-group">
            <span className="form__form-group-label">Jira</span>
            <div className="form__form-group-field">
              <Field
                name="jira_code"
                component={renderField}
                type="text"
              />
            </div>
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
          </div>
        </Col>
        <Col sm={6}>
          <div className="form__form-group d-flex">
            <span className="form__form-group-label" style={{padding: "5px 10px 0 0"}}>Hourly</span>
            <div className="form__form-group-field">
              <Field
                name="type"
                component={renderRadioButtonField}
                radioValue="HOURLY"
                defaultChecked={editProject[0]?.type === "HOURLY"}
                disabled={editProject[0]?.type === "FIXED_PRICE"}
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
                radioValue="FIXED_PRICE"
                defaultChecked={editProject[0]?.type === "FIXED_PRICE"}
                disabled={editProject[0]?.type === "HOURLY"}
              />
            </div>
          </div>
        </Col>
        {
          editProject[0]?.type !== "HOURLY" ? <>
              {
                _.isEmpty(editProject[0]?.milestones) ? (
                  <>
                    <Col className="col-12">
                      <h4>Milestones</h4>
                    </Col>
                    <Col className="col-3">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Name</span>
                        <div className="form__form-group-field">
                          <Field
                            name="milestones_name"
                            component={renderField}
                            type="text"
                          />
                        </div>
                      </div>
                    </Col>
                    <Col className="col-3">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Start Date</span>
                        <div className="form__form-group-field">
                          <Field
                            name="start_date"
                            component={renderField}
                            type="date"
                          />
                        </div>
                      </div>
                    </Col>
                    <Col className="col-3">
                      <div className="form__form-group">
                        <span className="form__form-group-label">End Date</span>
                        <div className="form__form-group-field">
                          <Field
                            name="end_date"
                            component={renderField}
                            type="date"
                          />
                        </div>
                      </div>
                    </Col>
                    <Col className="col-3">
                      <div className="form__form-group">
                        <span className="form__form-group-label">Estimated Amount</span>
                        <div className="form__form-group-field">
                          <Field
                            name="estimated_amount"
                            component={renderField}
                            type="text"
                          />
                        </div>
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col className="col-12">
                      <h4>Milestones</h4>
                    </Col>
                    <DataReactTable
                      classList={"table-milestones"}
                      sortTable={false}
                      search={false}
                      pagination={false}
                      reactTableData={{tableHeaderData: _.filter(columns, c => !checkHiddenColumns().includes(c.accessor)), tableRowsData: editProject[0]?.milestones?.map((c) => {
                          return {...c,
                            closed_date: !c.closed_date ? 'None' : c.closed_date,
                            actions:
                              <div className={"tableActions"}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmCloseMilestoneModal(true)}}
                                  className="btn_close"
                                >Close</button>
                              </div>
                          }
                        })}} />
                  </>
                )
              }
            </>
           : null
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
                        {/*{meta.touched && meta.error && <span className="form__form-group-error">*{meta.error}</span>}*/}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col sm={2} className={"col-1"}>
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
                        {/*{meta.touched && meta.error && <span className="form__form-group-error">*{meta.error}</span>}*/}
                      </div>
                    </div>
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
                <Col sm={2} className={"col-1"}>
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
              <SelectField
                name="selectInvoiceReceiver"
                value={ selectedInvoiceReceiver }
                onChange={(value) => {

                  setSelectedInvoiceReceiver(value);
                }}
                options={customers}
              />
            </div>
          </div>
        </Col>
        <Col className="col-12">
          <div className="form__form-group">
            <span className="form__form-group-label">Sales</span>
            <div className="form__form-group-field">
              <SelectField
                name="selectSales"
                value={ selectedSale }
                onChange={(value) => {

                  setSelectedSale(value);
                }}
                options={sales}
              />
            </div>
          </div>
        </Col>
        <Col className="col-12">
          <div className="form__form-group">
            <span className="form__form-group-label">PM</span>
            <div className="form__form-group-field">
              <SelectField
                name="selectPM"
                value={ selectedPM }
                onChange={(value) => {

                  setSelectedPM(value);
                }}
                options={pm}
              />
            </div>
          </div>
        </Col>
        <Col className="col-12">
          <ButtonToolbar className="form__button-toolbar d-flex w-100 justify-content-end">
            <Button color="primary" type="submit">Save</Button>
          </ButtonToolbar>
        </Col>
      </Row>
      <ConfirmModal
        color="primary"
        btn="Default"
        message={`Are you sure you want to close milestone for a project #${params.id}?`}
        toggle={() => setConfirmCloseMilestoneModal(!confirmCloseMilestoneModal)}
        modal={confirmCloseMilestoneModal}
        onNext={handleCloseMilestone}
      />
      <CustomModal
        successModal={successCloseMilestoneModal}
        toggleCloseModal={() => {
          setSuccessCloseMilestoneModal(!successCloseMilestoneModal);
          window.location.reload();
        }}
        textModal={`Milestone №${params.id} was successfully close!`}
        color={"success"}
      />
      <CustomModal
        successModal={failedCloseMilestoneModal}
        toggleCloseModal={() => setFailedCloseMilestoneModal(!failedCloseMilestoneModal)}
        textModal={messageCloseMilestoneError}
        color={"danger"}
      />
    </form>
  );
};

ProjectsEditForm = reduxForm({
  form: 'projects_edit_form',
})(ProjectsEditForm);

ProjectsEditForm = connect(
  state => {
    let editProjectStartDate = state?.editProjects?.editProject[0]?.date_start || '';
    let editProjectEndDate = state?.editProjects?.editProject[0]?.date_end === 'Date End Not Set' ? '' : state?.editProjects?.editProject[0]?.date_end;

    let splitStartDate = editProjectStartDate?.split('/') || [];
    let startDate = `${splitStartDate[1]}/${splitStartDate[0]}/${splitStartDate[2]}`;
    let splitEndDate = editProjectEndDate?.split('/') || [];
    let endDate = `${splitEndDate[1]}/${splitEndDate[0]}/${splitEndDate[2]}`;

    return {
      initialValues: {
        ...state.editProjects.editProject[0],
        project_name: state?.editProjects?.editProject[0]?.name,
        jira_code: state?.editProjects?.editProject[0]?.jira,
        date_start: editProjectStartDate ? new Date(startDate) : null,
        date_end: editProjectEndDate ? new Date(endDate) : null,
        selectStatus: {
          value: state?.editProjects?.editProject[0]?.status,
          label: state?.editProjects?.editProject[0]?.status
        },
        is_internal: !!state?.editProjects?.editProject[0]?.is_internal
      },
      enableReinitialize: true,
    }
  })(ProjectsEditForm)

export default ProjectsEditForm;