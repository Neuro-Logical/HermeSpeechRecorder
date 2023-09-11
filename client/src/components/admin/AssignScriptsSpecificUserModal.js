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

function AssignScriptsSpecificUserModal() {

    const location = useLocation();
    const accessCode = location.state.accessCode;

    const [currentState, setCurrentState] = useState({available_scripts: null})
    const [selectedScripts, setSelectedScripts] = useState([]);

    useEffect(() => {
      async function fetchData() {

          // fetch all users to display all users on admin page
          const result = await axios.get('/api/script/get_all_script_ids');

          const all_script_ids = result.data.map((script) => {
              return {value: script.id, label: script.id};
          })

          setCurrentState({...currentState, available_scripts: all_script_ids})
      }

      fetchData();

  }, [])

  const assign_task_url = "/api/user/assign_multiple_tasks"

  const handleAssignMultipleTasks = async () => {

      const selectedScriptIDs = selectedScripts.map((script) => {
        return script.value;
      })

      axios.post(assign_task_url, {
        user_id: accessCode,
        script_ids: selectedScriptIDs
      }).then(() => {
        handleClose()
      })
  }

  const navigate = useNavigate();

  const handleClose = (event) => {
    navigate('/admin', {
      state: {}
    })
  }


  const animatedComponents = makeAnimated();
  
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
                setSelectedScripts(selectedOption);
              }}
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[]}
              isMulti
              options={currentState.available_scripts}
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

export default AssignScriptsSpecificUserModal