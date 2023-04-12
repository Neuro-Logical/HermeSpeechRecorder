import React from 'react'
import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';

function UserAccordionComponent() {

    const [currentState, setCurrentState] = useState({users: null, accordionItems: null})

    const renderAccordionItem = (eventKey, header, body) => {
        return (
            <Accordion.Item eventKey={eventKey}>
                <Accordion.Header>{header}</Accordion.Header>
                <Accordion.Body>{body}</Accordion.Body>
            </Accordion.Item>
        )
    }

    useEffect(() => {
        async function fetchUsers() {
            const users = await axios.get('http://localhost:3000/user/get_all_users');

            setCurrentState({...currentState, users: users})
            console.log("users: ", users)
            console.log("currentState.users: ", currentState.users)

            var accordionItems = [];
            for (var i = 0; i < users.data.length; i++) {
                console.log(users.data[i].id)
                accordionItems.push(renderAccordionItem(users.data[i].id.toString() , users.data[i].id.toString(), (i+1).toString()))
            }

            setCurrentState({users: users, accordionItems: accordionItems})
        }

        fetchUsers();
    }, [])

  return (
    <Accordion>
        {currentState.accordionItems}
    </Accordion>
  );
}

export default UserAccordionComponent;