import React from 'react';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import ReactDOM from 'react-dom';

function CreateUserModal() {
    const [currentState, setCurrentState] = useState({accessCode: null});
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAccessCodeChange = (event) => {
        setCurrentState({
            accessCode: event.target.value
        })
    }

    const handleCreateUser = async () => {

        console.log("handleCreateUser accessCode: ", currentState.accessCode)

        fetch("http://localhost:3000/user/create", {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'user_id': currentState.accessCode
            })
        })
        .then(() => {
            handleClose()
        })
    }
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
            Create user
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="accessCode">
                <Form.Label>Access Code</Form.Label>
                <Form.Control
                  type="accessCode"
                  placeholder="3Kgnq!P"
                  onChange={handleAccessCodeChange}
                  autoFocus
                />
              </Form.Group>
              {/* <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group> */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

export default CreateUserModal