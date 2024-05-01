import React, { useState } from 'react';
import ProjectsAddForm from './ProjectsAddForm/ProjectsAddForm';
import { Col, Container, Row } from 'reactstrap';
import { postProject, postProjectMilestones } from '../../../../../utils/api';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../../../shared/components/customComponents/CustomModal/CustomModal';


const ProjectsAdd = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(null);
  const [successAddProjectModal, setSuccessAddProjectModal] = useState(false);
  const [failedAddProjectModal, setFailedAddProjectModal] = useState(false);
  const [messageAddProjectError, setMessageAddProjectError] = useState([]);
  const [failedAddMilestoneModal, setFailedAddMilestoneModal] = useState(false);
  const [messageAddMilestoneError, setMessageAddMilestoneError] = useState([]);

  const handleSubmit = (value) => {
    postProject(value).then(res => {
      if(res.data.success) {
        setProjectId(res.data.data.project_id);
        setSuccessAddProjectModal(!successAddProjectModal);

        if(value.type === "HOURLY") return;

        postProjectMilestones(res.data.data.project_id, value).then(res => {
          if(!res.data.success) {
            setMessageAddMilestoneError(res.data.errors);
            setFailedAddMilestoneModal(!failedAddMilestoneModal);
          }
        })
      } else {
        setMessageAddProjectError(res.data.errors);
        setFailedAddProjectModal(!failedAddProjectModal);
      }
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <ProjectsAddForm
            onSubmit={handleSubmit}
          />

          <CustomModal
            successModal={failedAddProjectModal}
            toggleCloseModal={() => setFailedAddProjectModal(!failedAddProjectModal)}
            textModal={messageAddProjectError}
            color={"danger"}
          />
          <CustomModal
            successModal={successAddProjectModal}
            toggleCloseModal={() => {
              setSuccessAddProjectModal(!successAddProjectModal);
              navigate("/dashboard/projects");
            }}
            textModal={`Project #${projectId} has been added!`}
            color={"success"}
          />
          <CustomModal
            successModal={failedAddMilestoneModal}
            toggleCloseModal={() => setFailedAddMilestoneModal(!failedAddMilestoneModal)}
            textModal={messageAddMilestoneError}
            color={"danger"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectsAdd;