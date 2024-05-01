const validate = (value) => {
  const errors = {};

  if(!value.first_name) {
    errors.first_name = 'First Name field shouldn’t be empty';
  }

  if(!value.last_name) {
    errors.last_name = 'Last Name field shouldn’t be empty';
  }

  if(!value.email) {
    errors.email = 'Email field shouldn’t be empty';
  }

  if(!value.selectRoles) {
    errors.selectRoles = 'Role field shouldn’t be empty';
  }

  return errors;
}

export default validate;