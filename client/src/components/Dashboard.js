import React from 'react'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'fetch';
import DashboardCard from './DashboardCard';
import { useLocation } from 'react-router-dom';
import url from 'url';

function Dashboard() {

    const [currentState, setCurrentState] = useState({scriptCount: 0, assignedTasks: [], cards: []})
    const [isFetched, setIsFetched] = useState(false);
    const [isCardsCreated, setIsCardsCreated] = useState(false);

    const location = useLocation();
    const accessCode = location.state.accessCode; 

    useEffect(() => {

        async function fetchAssignedTasks() {

            const assignedTasks = await axios.post('/api/user/get_assigned_tasks/', {user_id: accessCode});
            console.log(assignedTasks.data.tasks)

            if (currentState.assignedTasks === assignedTasks.data.tasks) {
                return;
            }

            var cards = [];
            for (var i = 0; i < assignedTasks.data.tasks.length; i++) {
                // compatible to diff types
                assignedTasks.data.tasks[i].type ? 
                    cards.push(<DashboardCard type={assignedTasks.data.tasks[i].type} script_id={assignedTasks.data.tasks[i].script_id} accessCode={accessCode} line={assignedTasks.data.tasks[i].desc}/>)
                :
                    cards.push(<DashboardCard type={'script'} script_id={assignedTasks.data.tasks[i]} accessCode={accessCode}/>)
            }
            setCurrentState({...currentState, assignedTasks: assignedTasks.data.tasks, cards: cards});
            setIsFetched(true);
        }

        fetchAssignedTasks();

    }, []);

    if (!isFetched) {
        return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}>Loading the data {console.log("loading state")}</div>
      );
    }

    return (
        <>
        <br></br>
        <div className='center'>Welcome, {accessCode}. You have {currentState.assignedTasks.length} tasks to complete.</div>
        <br></br>
        {currentState.cards}
        </>
    )
}

export default Dashboard