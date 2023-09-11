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

function UnassignScriptSpecificUserModal() {

    const location = useLocation();
    const accessCode = location.state.accessCode;

    const [currentState, setCurrentState] = useState({available_scripts: null, assigned_scripts: [], select_module: null})
    const [selectedScripts, setSelectedScripts] = useState([]);

    useEffect(() => {

        function renderSelectModule(defaultValues) {
            return (
                <>
                  <Modal show={true}>
                    <Modal.Header closeButton onClick={handleClose}>
                      <Modal.Title>Unassign Scripts</Modal.Title>
                    </Modal.Header>
          
                    <Modal.Body className='unassign_scripts_select_modal'>
                      Unselect scripts you would like to unassign from this user
                      <Select
                        onChange={(selectedOption) => {
                            console.log("onChange selectedOption: ", selectedOption)
                            setSelectedScripts(selectedOption);
                        }}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={defaultValues}
                        isMulti
                        options={defaultValues}
                      />
                    </Modal.Body>
          
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={handleUnAssignScripts}>
                              Confirm
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </>
              );
          }

      async function fetchData() {

          // fetch all users to display all users on admin page
          const all_scripts = await axios.get('/api/script/get_all_script_ids');

          const all_script_ids = all_scripts.data.map((script) => {
              return {value: script.id, label: script.id};
          })

          const assigned_scripts_res = await axios.post(
            '/api/user/get_assigned_tasks',
            {
                "user_id": accessCode
            }
          );

          const assigned_scripts = assigned_scripts_res.data.tasks;
          const assigned_scripts_options = assigned_scripts.map((script) => {
            return {value: script, label: script};
          })

          setCurrentState({...currentState, available_scripts: all_script_ids, assigned_scripts: assigned_scripts_options})

          const select_module = renderSelectModule(assigned_scripts_options)
          setCurrentState({...currentState, select_module: select_module})
      }

      fetchData();

  }, [selectedScripts])

  const unassign_script_url = "/api/script/update_assigned_task"

  const handleUnAssignScripts = async () => {
    console.log("handleUnAssignScripts selectedScripts: ", selectedScripts)

      const selectedScriptIDs = selectedScripts.map((script) => {
        return script.value;
      })

      console.log("selectedScriptIDs: ", selectedScriptIDs);

      fetch(unassign_script_url, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
              'user_id': accessCode,
              'script_ids': selectedScriptIDs
          })
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
    currentState.select_module
  )
  
}

export default UnassignScriptSpecificUserModal