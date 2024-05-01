/* eslint-disable */
const validate = (values) => {
  const errors = {};

  if (!values.select) {
    errors.select = 'Please select the option';
  }

  return errors;
};

export default validate;

