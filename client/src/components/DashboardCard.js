import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RecordingModal from './RecordingModal'
import { Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function DashboardCard({script_id, accessCode}) {
    console.log("script id: ", script_id)
    console.log("card access code: ", accessCode)

    const navigate = useNavigate();

    const handleClick = (event) => {
        navigate('/module', {
            state: {
                accessCode: accessCode,
                script_id: script_id
            }
        })
    }

  return (
    <div class="card text-center">
    <div class="card-header">
        Script #{script_id}
    </div>
    <div class="card-body">
        <h3 class="card-title">Script {script_id}</h3>
        <p class="card-text">Script Text</p>
        <button class="btn btn-primary" onClick={handleClick}>Start</button>
    </div>
    <div class="card-footer text-muted">
    </div>
    <br></br>
    </div>
  )
}

export default DashboardCard