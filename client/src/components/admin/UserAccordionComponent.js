import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'fetch';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { Link, useNavigate } from 'react-router-dom'

function UserAccordionComponent() {

    const [currentState, setCurrentState] = useState({users: null, accordionItems: null});

    const assign_task_url = "/api/user/assign_task"
    const delete_user_url = "/api/user/delete_user"

    const handleAssignTask = async (accessCode, script_id) => {

        console.log("handleAssignScriptsSpecificUser accessCode: ", accessCode)

        fetch(assign_task_url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'user_id': accessCode,
                'script_id': script_id
            })
        })
    }

    const handleDeleteUser = async (user_data) => {
        console.log("user id: ", user_data.id)

        fetch(delete_user_url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'user_id': user_data.id
            })
        })
    }

    const renderAccordionItem = (eventKey, header, user_data) => {
        return (
            <Accordion.Item eventKey={eventKey}>
                <Accordion.Header>{header}</Accordion.Header>
                <Accordion.Body>{formatUserDetailsSection(user_data)}</Accordion.Body>
            </Accordion.Item>
        )
    }

    const navigate = useNavigate();

    const handleAssignScriptClick = (user_data) => {

        navigate('/assign-script-specific', {
            state: {
                accessCode: user_data.id
            }
        })
    }

    const handleUnassignScriptClick = (user_data) => {

        navigate('/unassign_script_specific_user', {
            state: {
                accessCode: user_data.id
            }
        })
    }

    const renderAssignScriptsSpecificUserModalButton = (user_data) => {
        return (
            <>
                <Button variant="success" onClick={() => handleAssignScriptClick(user_data)}>
                    Assign scripts to this user
                </Button>
            </>

        )
    }

    const renderUnAssignScriptsModalButton = (user_data) => {
        return (
            <Button variant="warning" onClick={() => handleUnassignScriptClick(user_data)}>
                Unassign scripts from this user
            </Button>
        )
    }

    const renderDeleteUserButton = (user_data) => {
        return (
            <Button variant="danger" onClick={() => handleDeleteUser(user_data)}>
                Delete user
            </Button>
        )
    }

    const formatUserDetailsSection = (user_data) => {

        return (
            <div>
                <div>
                    <Alert key="info" variant="info" className='font_black'>
                        Created on {user_data.createdAt.substring(0, 10)}, Last active on {user_data.updatedAt.substring(0, 10)}
                    </Alert>
                </div>
                <div>
                    {formatAssignedTasksSection(user_data.assignedTasks.tasks, user_data.taskProgress)}
                </div>
                <div>
                    {formatCompletedTasksSection(user_data.completedTasks.tasks)}
                </div>
                <div>
                    {renderAssignScriptsSpecificUserModalButton(user_data)}  {renderUnAssignScriptsModalButton(user_data)} {renderDeleteUserButton(user_data)}
                </div>
            </div>
        )
    }

    const formatCompletedTasksSection = (tasks) => {
        if (tasks.length === 0) {
            return (
                <Alert key="secondary" variant="secondary">
                    No scripts completed yet
                </Alert>
            )
        }

        return (
            <Alert key="success" variant="success">
                {tasks.length} script(s) completed
                <ul>
                    {tasks.map((task, index) =>
                        <li key={index}>
                        {task}
                        </li>
                    )}
                </ul>
            </Alert>
            )
    }

    const formatAssignedTasksSection = (tasks, progress) => {
        if (tasks.length === 0) {
            return (
                <Alert key="primary" variant="primary" className='font_black'>
                    No scripts assigned
                </Alert>
            )
        }

        return (
            <Alert key="primary" variant="primary" className='font_black'>
                {tasks.length} script(s) assigned
                <ul>
                    {tasks.map((task, index) => {
                        task = task.script_id ? task.script_id : task
                        if (!progress.hasOwnProperty(task)) {
                            return (<li key={index}>
                                {task} - Not in progress
                            </li>)
                        } else {
                            return (<li key={index}>
                            {task} - In progress
                            </li>)
                        }
                    }
                    )}
                </ul>
            </Alert>
        )}

    useEffect(() => {
        async function fetchData() {

            // fetch all users to display all users on admin page
            const users = await axios.get('/api/user/get_all_users');

            setCurrentState({...currentState, users: users})

            var accordionItems = users.data.map((user_data) => {
                return renderAccordionItem(user_data.id.toString() , user_data.id.toString(), user_data)
            })

            setCurrentState({users: users, accordionItems: accordionItems})
        }

        fetchData();

    }, [])

  return (
    <Accordion>
        {currentState.accordionItems}
    </Accordion>
  );
}

export default UserAccordionComponent;