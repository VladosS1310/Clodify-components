const validate = (values) => {
  const errors = {};

  if (!values.branch) {
    errors.branch = 'Branch field shouldn’t be empty';
  }

  if (!values.access_roles) {
    errors.access_roles = 'Roles field shouldn’t be empty';
  }

  return errors;
};

export default validate;
