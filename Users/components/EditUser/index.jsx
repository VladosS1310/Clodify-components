import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import EditUserForm from './EditUserForm/EditUserForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserFetchingAction } from '../../../../../redux/actions/editUserActions';
import { putEditUser } from '../../../../../utils/api';
import CustomModal from '../../../../../shared/components/customComponents/CustomModal/CustomModal';

const EditUser = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successEditUserModal, setSuccessEditUserModal] = useState(false);
  const [failedEditUserModal, setFailedEditUserModal] = useState(false);
  const [messageEditUserError, setMessageEditUserError] = useState('');

  useEffect(() => {
    dispatch(getUserFetchingAction(params.id));
  }, [params.id, dispatch])

  const editUser = (value) => {
    putEditUser(value, params.id).then(res => {
      if(res.data.success) {
        setSuccessEditUserModal(!successEditUserModal);
      } else {
        setMessageEditUserError(res.data.errors[0].message);
        setFailedEditUserModal(!failedEditUserModal);
      }
    })
  }

  return (
    <Container>
      <Row>
        <Col>
          <EditUserForm onSubmit={editUser} />

          <CustomModal
            successModal={failedEditUserModal}
            toggleCloseModal={() => setFailedEditUserModal(!failedEditUserModal)}
            textModal={messageEditUserError}
            color={"danger"}
          />
          <CustomModal
            successModal={successEditUserModal}
            toggleCloseModal={() => {
              setSuccessEditUserModal(!successEditUserModal);
              navigate("/dashboard/users");
            }}
            textModal={`User #${params.id} has been changed!`}
            color={"success"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EditUser;