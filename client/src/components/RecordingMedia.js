import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { RecordState } from 'audio-react-recorder'
import { message, Button } from 'antd';
import axios from 'fetch'
import UtteranceDisplayer from './UtteranceDisplayer';
import ScriptController from './ScriptController'

function RecordingMedia(){
    const location = useLocation();
    const navigate = useNavigate();

    const accessCode = location.state.accessCode;
    const userID = accessCode;
    const scriptID = location.state.script_id;
    const type = location.state.type;
    const line = location.state.line;

    const RECORDING_DELAY = 1000;

    // state
    const [checkBlob, setCheckBlob] = useState(null);
    const [currentState, setCurrentState] = useState({currentLine: 0, recordState: null, review: false, totalLines: [], startState: false, addr:'', completed: false})

    // new recorder library
    const recorderControls = useAudioRecorder()

    // effect
    useEffect(()=>{
        async function fetchScript() {
            const res = await axios.post('/api/media/get_id', {script_id: scriptID});

            const script = res.data;

            console.log('===>', line, script.desc)
            setCurrentState({
                ...currentState,
                totalLines: script.desc,
                currentLine: line,
                addr: script.addr
            })
        }

        fetchScript()
    }, [])

    // delay medias showup
    useEffect(() => {
    
        function visibility_timeout() {
    
          if (document.getElementById("record_media") !== null) {
            setTimeout(function() {
              document.getElementById('record_media').style.visibility = 'visible';
            }, 500);
          }
        }
    
        if(recorderControls.isRecording) visibility_timeout();
    
    }, [recorderControls.isRecording])

    const stopAudioRecorder = (save) => {
        recorderControls.stopRecording();
    }

    const createFileName = () => {
        let fileName = `${accessCode}_${type}_${scriptID}_${line.toString().padStart(4, '0')}.webm`
        return fileName;
    }

    const startModule = async () => {
        setCurrentState({...currentState, startState: true})
    }

    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        setCheckBlob(url);
    };

    const start = async (event) => {
        setCurrentState({
            ...currentState,
            recordState: RecordState.START,
            review: false
        })
        
        recorderControls.startRecording()
    }

    const pause = (event) => {
        setCurrentState({
            ...currentState,
            recordState: RecordState.PAUSE,
        })
    }

    const stop = async (event) => {
        await new Promise(resolve => setTimeout(resolve, RECORDING_DELAY))
        .then(() => {
            setCurrentState({
                ...currentState,
                recordState: RecordState.STOP,
                review: true
            })
        })
        .then(() => {
            recorderControls.stopRecording(); 
        })
    }

    const saveBlob = async (event) => {

        setCheckBlob(null);

        recorderControls.stopRecording();
  
        var blob = recorderControls.recordingBlob
        var fileName = createFileName()

        // automatically upload
        let formData = new FormData();
        formData.append('filename', blob, fileName);
        try {
            axios.post('/api/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }).then(()=>{
                setCurrentState({
                    ...currentState,
                    completed: true
                })
            })
        } catch (error) {
            message('error', error)
        }
    };

    const restart = async (event) => {
        setCurrentState({
            ...currentState,
            recordState: RecordState.START,
            review: false,
        })
        setCheckBlob(null);
        stopAudioRecorder(false);

        recorderControls.startRecording()
    }

    const renderComplete = () => {
        return (
            <div>
                <Button onClick={handleComplete}>Exit</Button>
            </div>
        )
    }

    const handleComplete = async (event) => {
        event.preventDefault();

        await axios.post("/api/media/unassign_task", {
            user_id: accessCode,
            script_id: scriptID,
            desc: line
        }).then(() => {
            navigate('/dashboard', {
                state: {
                    accessCode: accessCode
                }
            })
            window.location.reload()
        })
    }

    const renderRecorder = () => {
        return (
            <div className='central_recorder'>
              {checkBlob && 
              <>
                <audio src={checkBlob} controls />
                <div class="color: blue">Please Review Your Recording</div>
              </>
              }
              <AudioRecorder 
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                onNotAllowedOrFound={(err) => console.table(err)}
                // downloadOnSavePress={true}
                downloadFileExtension="webm"
                recorderControls={recorderControls}
                showVisualizer
                classes={{
                  AudioRecorderStartSaveClass: 'display_none',
                  AudioRecorderPauseResumeClass: 'display_none',
                  AudioRecorderDiscardClass: 'visibility_hidden'
                }}
              />
              {<ScriptController start={start} review={stop} pause={pause} restart={restart} save={saveBlob} recordingState={currentState.recordState} reviewState={currentState.review} ></ScriptController>}
            </div>
          )
    }

    const UtteranceDisplayerRendering = () => {
        return <UtteranceDisplayer currentRecordState={recorderControls.isRecording} line={currentState.totalLines} current_line={currentState.currentLine}></UtteranceDisplayer>
    }

    const renderRecordingModal = () => {
        return (
            <>
                <div className='utterance_display'>
                    {UtteranceDisplayerRendering()}
                </div>
                <br/>
                <div className='center'>
                    <img id='record_media' alt="example" style={{width: '800px', visibility: 'hidden'}} src={currentState.addr}/>
                    {renderRecorder()}
                </div>
            </>
        )
    }

    if (!currentState.startState) {
        return (
        <div className='vertical_center'>
            <div className='large_font_blue_center'>
            You are about to start {type} # {scriptID}.
            <br />
            Please press START when you are ready to begin/resume.
            </div>
            <br />
            
            <div className='login_button'>
                <button class="btn btn-primary" onClick={startModule}>Start</button>
            </div>
        </div>
        )
    }

    return(
        <div>
            {!currentState.completed && renderRecordingModal()}
            {currentState.completed && renderComplete()}
        </div>
    )
}

export default RecordingMedia