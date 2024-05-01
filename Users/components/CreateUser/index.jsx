import React, { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import FormCreateUser from './FormCreateUser/FormCreateUser';
import { postCreateUser } from '../../../../../utils/api';
import CustomModal from '../../../../../shared/components/customComponents/CustomModal/CustomModal';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [successAddUserModal, setSuccessAddUserModal] = useState(false);
  const [failedAddUserModal, setFailedAddUserModal] = useState(false);
  const [messageAddUserError, setMessageAddUserError] = useState('');
  const addUser = (value) => {
    postCreateUser(value).then(res => {
      if(res.data.success) {
        setUserId(res.data.data.user_id);
        setSuccessAddUserModal(!successAddUserModal);
      } else {
        setMessageAddUserError(res.data.errors[0].message);
        setFailedAddUserModal(!failedAddUserModal);
      }
    })
  }

  return (
    <Container>
      <Row>
        <Col>
          <FormCreateUser onSubmit={addUser} />

          <CustomModal
            successModal={failedAddUserModal}
            toggleCloseModal={() => setFailedAddUserModal(!failedAddUserModal)}
            textModal={messageAddUserError}
            color={"danger"}
          />
          <CustomModal
            successModal={successAddUserModal}
            toggleCloseModal={() => {
              setSuccessAddUserModal(!successAddUserModal);
              navigate("/dashboard/users");
            }}
            textModal={`User #${userId} has been added!`}
            color={"success"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUser;