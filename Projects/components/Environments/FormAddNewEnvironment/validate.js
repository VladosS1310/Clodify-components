/* eslint-disable */
const validate = (values) => {
  const errors = {};

  if (!values.branch) {
    errors.branch = 'Key field shouldn’t be empty';
  }

  if (!values.roles) {
    errors.roles = 'Value field shouldn’t be empty';
  }

  return errors;
};

export default validate;
