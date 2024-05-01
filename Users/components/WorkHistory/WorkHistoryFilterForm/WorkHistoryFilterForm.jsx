import React from 'react';
import { Button, Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderDatePickerField from '../../../../../../shared/components/form/DatePicker';


const WorkHistoryFilterForm = ({handleSubmit, resetForm, reset}) => {
  return (
    <form  onSubmit={handleSubmit} className="form w-100 form_WorkHistoryFilter">
      <Col sm={12} xxl={2}>
        <div className="form__form-group">
          <span className="form__form-group-label">Date Start</span>
          <div className="form__form-group-field bg-white">
            <Field
              name="date_start"
              component={renderDatePickerField}
              maxDate={new Date()}
            />
          </div>
        </div>
      </Col>
      <Col sm={12} xxl={2}>
        <div className="form__form-group">
          <span className="form__form-group-label">Date End</span>
          <div className="form__form-group-field bg-white">
            <Field
              name="date_end"
              component={renderDatePickerField}
              maxDate={new Date()}
            />
          </div>
        </div>
      </Col>
      <Col sm={12} xxl={8}>
        <div className="form_work_history-filter-buttons mt-3">
          <Button type="button" color="outline-secondary" onClick={() => { resetForm(); reset() }} style={{maxHeight: "43px"}} className="mt-1">
            Clear Filters
          </Button>
          <Button type="submit" color="primary" style={{maxHeight: "43px"}} className="mt-1">
            Apply Filters
          </Button>
        </div>
      </Col>
    </form>
  );
};

export default reduxForm({
  form: 'work_history_filter_form',
  initialValues: {
    date_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    date_end: new Date()
  }
})(WorkHistoryFilterForm);