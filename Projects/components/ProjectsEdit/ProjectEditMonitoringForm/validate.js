const validate = (values) => {
  const errors = {};

  if (!values.url) {
    errors.url = 'Url field shouldn’t be empty';
  }

  if (!values.notification_emails) {
    errors.notification_emails = 'Notification Emails field shouldn’t be empty';
  }

  return errors;
};

export default validate;

