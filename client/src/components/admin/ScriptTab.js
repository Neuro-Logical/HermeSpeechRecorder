import React, { useState } from 'react'
import AddScriptButton from './AddScriptButton'
import ScriptTabbedList from './ScriptTabbedList'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ScriptTab() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const RenderAddScriptModal = () => {
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Add script
        </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create scripts from CSV</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {AddScriptButton()}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
              Close
            </Button> */}
            <Button variant="primary" onClick={handleClose}>
              Exit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <div>
      <div className='padding_bottom_20'>
        <RenderAddScriptModal />
      </div>
        <ScriptTabbedList />
    </div>
  )
}

export default ScriptTab