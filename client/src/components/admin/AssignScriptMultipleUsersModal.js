import React from 'react';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'fetch';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom'

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function AssignScriptMultipleUsersModal() {

    const get_all_users_url = '/api/user/get_all_users'; 

    const location = useLocation();
    const script_id = location.state.script_id;
    const navigate = useNavigate();

    const [currentState, setCurrentState] = useState({all_users: null})
    const [selectedUsers, setSelectedUsers] = useState([]);

    console.log("Script id: ", script_id)

    useEffect(() => {
        async function fetchData() {
  
            // fetch all users to display all users on admin page
            const fetched_users = await axios.get(get_all_users_url);
  
            const all_users = fetched_users.data.map((user) => {
                return {value: user.id, label: user.id};
            })

            setCurrentState({...currentState, all_users: all_users})
        }
  
        fetchData();
  
    }, [])

    const handleClose = (event) => {
        navigate('/admin', {
        state: {}
        })
    }

    const animatedComponents = makeAnimated();

    const assign_task_to_multiple_users_url = "/api/script/assign_task_to_multiple_users"

    const handleAssignMultipleTasks = async () => {

        const selectedUserIDs = selectedUsers.map((user) => {
            return user.value;
        })

        console.log("selectedUserIDs: ", selectedUserIDs);

        fetch(assign_task_to_multiple_users_url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'user_ids': selectedUserIDs,
                'script_id': script_id
            })
        })
        .then(() => {
            handleClose()
        })
    }
  
    return (
      <>
        <Modal show={true}>
          <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title>Assign Scripts</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Select scripts
            <Select
              onChange={(selectedOption) => {
                console.log(selectedOption);
                setSelectedUsers(selectedOption);
              }}
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[]}
              isMulti
              options={currentState.all_users}
            />
          </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleAssignMultipleTasks}>
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
    );
}

export default AssignScriptMultipleUsersModal