import React from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios';

function SaveProgressButton({user_id, script_id, current_line}) {

    function displayProgressUpdateAlert(line_to_update) {
        alert("Progress successfully saved at line #" + line_to_update.toString() + "!")
    }

    async function saveProgress(user_id, script_id, line) {
        const line_to_update = (line >= 0) ? line : 0;
        await new Promise(
            async resolve => 
                await axios.post('http://localhost:3000/user/update_task_progress', {user_id: user_id, script_id: script_id, current_line: line_to_update})
            )
            .then(displayProgressUpdateAlert(line_to_update))
    }

  return (
    <Button className='button_right_align' onClick={() => saveProgress(user_id, script_id, current_line - 1)}>
        Save Progress
    </Button>
  )
}

export default SaveProgressButton