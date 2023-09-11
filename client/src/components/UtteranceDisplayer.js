import React from 'react'
import { useState, useEffect } from 'react';
import SaveProgressButton from './SaveProgressButton';

function UtteranceDisplayer({user_id, script_id, line, current_line, currentRecordState}) { 

  // console.log("current record state in utterance displayer: ", currentRecordState)

  const [prevLine, setPrevLine] = useState('')

  useEffect(() => {
    
    function visibility_timeout() {

      console.log("visibility_timeout")
      if (document.getElementById("utterence_line_display") !== null) {
        document.getElementById('utterence_line_display').style.visibility = 'hidden';
        setTimeout(function() {
          document.getElementById('utterence_line_display').style.visibility = 'visible';
        }, 1000);
      }
    }

    visibility_timeout();

  }, [current_line])

  // add the prevLine
  useEffect(()=>{
    if(currentRecordState) setPrevLine(line[current_line])
  },[currentRecordState])
  
  return (
    <><div className='float-container'>
      <div className='float-left-child'>
        <div>Current utterance:</div>

      </div>
      <div className='float-right-child'>
        {/* {line[current_line]} */}
        {currentRecordState && line[current_line]}
        {!currentRecordState && prevLine}
      </div>

    </div>
    {/* <div>{SaveProgressButton({ user_id: user_id, script_id: script_id, current_line: current_line })}</div>  */}
    </>

  )
}

export default UtteranceDisplayer