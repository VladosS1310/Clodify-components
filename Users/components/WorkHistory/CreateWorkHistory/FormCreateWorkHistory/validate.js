const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = 'Tittle can not be blank!';
  }

  if (!values.date_start) {
    errors.date_start = 'Date Start can not be blank!';
  }

  if (!values.date_end) {
    errors.date_end = 'Date End can not be blank!';
  }

  if (!values.selectType) {
    errors.selectType = 'Type can not be blank!';
  }

  return errors;
};

export default validate;

