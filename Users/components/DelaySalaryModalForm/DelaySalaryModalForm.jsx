import React, { useEffect } from 'react';
import { Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import validate from "./validate";
import {renderField} from '../../../../../utils/helpers';


const DelaySalaryModalForm = ({toggle, modal, handleSubmit, initialize, setDelaySalaryModal, salaryUser, salaryNameUser}) => {
  useEffect(() => {
    initialize({
      month: 1,
      salary: salaryUser
    });
  }, [initialize, salaryUser])

  return (
    <div className="d-flex justify-content-center w-100">
      <Modal toggle={toggle} className="theme-light ltr-support add-income" isOpen={modal} style={{maxWidth: "800px", padding: 0, margin: "28px auto"}}>
        <ModalHeader>
          <h4>{`Set the salary with a delay for ${salaryNameUser}`}</h4>
        </ModalHeader>
        <ModalBody>
          <form className='form form-add-income' onSubmit={handleSubmit}>
            <Col className="col-12">
              <div className='form__form-group'>
                <span className='form__form-group-label'>Enter Month (1-12)</span>
                <div className='form__form-group-field'>
                  <Field
                    name='month'
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
                  <span className="d-flex pt-2">$</span>
                  <Field
                     name='salary'
                     component={renderField}
                     type="input"
                   />
                </div>
              </div>
            </Col>
            <Col sm={12} className='d-flex justify-content-between'>
              <button type='button' className='btn btn-danger' onClick={() => setDelaySalaryModal(!modal)}>Cancel</button>
              <button type='submit' className='btn btn-primary'>Save</button>
            </Col>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default reduxForm({
  form: 'delaySalaryModalForm',
  validate
})(DelaySalaryModalForm);