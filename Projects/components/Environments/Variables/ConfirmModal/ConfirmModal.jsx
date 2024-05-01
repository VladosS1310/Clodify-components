import React from 'react';
import { Button, ButtonToolbar, Modal } from 'reactstrap';

const ConfirmModal = ({ color, message, colored, modal, toggle, onNext }) => {
  return (
    <div>
      <Modal
        isOpen={!!modal}
        toggle={toggle}
        modalClassName="ltr-support"
        className="modal-dialog--primary theme-light"
      >
        <div className="modal__header">
          <button
            className="lnr lnr-cross modal__close-btn"
            type="button"
            onClick={() => toggle()}
          />
        </div>
        <div className="modal__body">{message}</div>
        <ButtonToolbar className="modal__footer">
          <Button
            className="modal_cancel"
            value="Cancel"
            onClick={() => toggle()}
          >
            Cancel
          </Button>{' '}
          <Button
            className="modal_ok"
            value="Ok"
            data-testid="confirm-delete"
            outline={colored}
            color={color}
            onClick={() => onNext(modal)}
          >
            Ok
          </Button>
        </ButtonToolbar>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
