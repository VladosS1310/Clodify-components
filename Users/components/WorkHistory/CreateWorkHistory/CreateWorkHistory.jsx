import React, { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import FormCreateWorkHistory from './FormCreateWorkHistory/FormCreateWorkHistory';
import { postWorkHistory } from '../../../../../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import CustomModal from '../../../../../../shared/components/customComponents/CustomModal/CustomModal';

const CreateWorkHistory = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [workHistoryModal, setWorkHistoryModal] = useState(false);
  const [successWorkHistoryModal, setSuccessWorkHistoryModal] = useState(false);
  const [failedWorkHistoryModal, setFailedWorkHistoryModal] = useState(false);
  const [messageWorkHistoryError, setMessageWorkHistoryError] = useState('');

  const createWorkHistory = (value) => {
    postWorkHistory(params.id, value).then(res => {
      if(res.data.success) {
        setWorkHistoryModal(!workHistoryModal);
        setSuccessWorkHistoryModal(!successWorkHistoryModal);
      } else {
        setMessageWorkHistoryError(res.data.errors[0].message);
        setFailedWorkHistoryModal(!failedWorkHistoryModal);
      }
    })
  }
  return (
    <Container>
      <Row>
        <Col>
          <FormCreateWorkHistory onSubmit={createWorkHistory} />

          <CustomModal
            successModal={failedWorkHistoryModal}
            toggleCloseModal={() => setFailedWorkHistoryModal(!failedWorkHistoryModal)}
            textModal={messageWorkHistoryError}
            color={"danger"}
          />
          <CustomModal
            successModal={successWorkHistoryModal}
            toggleCloseModal={() => {
              setSuccessWorkHistoryModal(!successWorkHistoryModal);
              navigate(`/dashboard/users/${params.id}/work-history`)
            }}
            textModal={`The Work History is saved!`}
            color={"success"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreateWorkHistory;