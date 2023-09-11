import React from 'react'
import RecordingModal from './RecordingModal'
import { Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

function DashboardCard({script_id, accessCode, type, line}) {
    const navigate = useNavigate();

    const handleClick = (event) => {
        if(type !== 'script'){
            navigate('/record', {
                state: {
                    accessCode: accessCode,
                    script_id: script_id,
                    type,
                    line
                }
            })
        }else{
            navigate('/module', {
                state: {
                    accessCode: accessCode,
                    script_id: script_id,
                    type
                }
            })
        }
    }

  return (
    <div class="card text-center">
    <div class="card-header">
        {`${type?type:'Script'}#${script_id}`}
    </div>
    <div class="card-body">
        <h3 class="card-title">{`${type?type:'Script'}#${script_id}`}</h3>
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