const validate = (values) => {
  const errors = {};

  if (!values.month) {
    errors.month = 'Month field shouldn’t be empty'
  } else if(!/^[0-9.]*$/.test(values.month)) {
    errors.month = 'Invalid data type';
  } else if(Number(values.month) > 12 || Number(values.month) <= 0) {
    errors.month = 'Month field should be more than 1 and less than 12';
  }

  if (!values.salary) {
    errors.salary = 'Salary field shouldn’t be empty'
  } else if(!/^[0-9]*$/.test(values.salary)) {
    errors.salary = 'Invalid data type';
  }

  return errors;
};

export default validate;
