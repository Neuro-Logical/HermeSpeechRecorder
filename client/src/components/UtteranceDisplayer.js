import React from 'react'
import { useState, useEffect } from 'react';
import SaveProgressButton from './SaveProgressButton';

function UtteranceDisplayer({user_id, script_id, line, current_line, currentRecordState}) {

  // console.log("current record state in utterance displayer: ", currentRecordState)

  const [currentState, setCurrentState] = useState({line_to_display: ""})

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

  const mystyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10px",
    fontFamily: "Arial",
  };
  

  return (
    <div style={mystyle}>
      {/* Current utterance: {(currentRecordState === "start" || currentRecordState === "stop") ? (<a className='utterance_display_bold'>{currentState.line_to_display}</a>) : (<a className='utterance_display_bold'></a>)} */}
      Current utterance: {currentRecordState !== null && <a id='utterence_line_display' className='utterance_display_bold'>{line}</a>}
      {SaveProgressButton({user_id: user_id, script_id: script_id, current_line: current_line})}
      </div>
  )
}

export default UtteranceDisplayer