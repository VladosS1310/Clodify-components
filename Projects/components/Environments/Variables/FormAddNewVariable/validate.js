const validate = (values) => {
  const errors = {};

  if (!values.key || values.key === ' ') {
    errors.key = 'Key field shouldn’t be empty';
  }

  if(!values.value || values.value === ' ') {
    errors.value = "Value field shouldn’t be empty";
  }

  return errors;
};

export default validate;

