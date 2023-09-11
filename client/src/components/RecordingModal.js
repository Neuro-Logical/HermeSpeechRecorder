import React from 'react'
import ScriptController from './ScriptController'
import { useState, useEffect } from 'react';
import UtteranceDisplayer from './UtteranceDisplayer';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import AudioPlayer from './AudioPlayer';
import ReviewPage from './ReviewPage';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'fetch'
import { Button } from 'react-bootstrap';
import renderProgressBar from './ProgressBar';
import { create_csv_receipt } from './utils/CSVReceiptUtils';
import { notification } from 'antd';

// new recorder library
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';


function RecordingModal() {

    const location = useLocation();
    console.log("location: ", location)
    const navigate = useNavigate();

    const accessCode = location.state.accessCode;
    const userID = accessCode;
    const scriptID = location.state.script_id;

    console.log("script id in modal: ", scriptID);
    console.log("access code: ", accessCode)

    const [currentState, setCurrentState] = useState({currentLine: 0, recordState: null, audioData: null, review: false, totalLines: 0, startState: false})
    const [currentUtterances, setCurrentUtterances] = useState([]);
    const [currentUtteranceDetails, setCurrentUtteranceDetails] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [error, setError] = useState("");
    const [checkBlob, setCheckBlob] = useState(null);

    const RECORDING_DELAY = 1000;
    const RECORDING_DELAY_HALF = 500;

    // new recorder library
    const recorderControls = useAudioRecorder()
    const [shouldSave, setShouldSave] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, msg) => {
        api[type]({
          message: type,
          description: msg,
        });
    };

    const stopAudioRecorder = (save) => {
        setShouldSave(save);
        recorderControls.stopRecording();
    }

    useEffect(() => {

        async function fetchScript() {
            const script = await axios.post('/api/script/findScriptID/', {script_id: scriptID});
            console.log(script.data.utterances.utterances)
            setCurrentUtterances(script.data.utterances.utterances)
            setCurrentUtteranceDetails(script.data.utterances.details)
            console.log("numLines: ", script.data.utterances.utterances.length)

            const progress = await fetchProgress();

            setCurrentState({...currentState, totalLines: script.data.utterances.utterances.length, currentLine: progress})
            
            setIsFetched(true)
        }

        async function fetchProgress() {
            const user_data = await axios.post('/api/user/get_user_by_id', {user_id: userID});
            const all_progress = user_data.data["taskProgress"];
            if (all_progress.hasOwnProperty(scriptID.toString())) {
                console.log("most recent progress: ", all_progress[scriptID.toString()]);
                return all_progress[scriptID.toString()];
            }
            return 0;
        }

        fetchScript();
        fetchProgress();
    }, [])

    const previousLine = (event) => {
        var originalLineNumber = currentState.currentLine
        if (currentState.currentLine >= 1) {
            setCurrentState({
                ...currentState,
                currentLine: originalLineNumber - 1
            })
        }
        console.log("previous line: ", currentState.currentLine)
    }

    const review = async (event) => {
        console.log("stop recording after one second")
        
        await new Promise(resolve => setTimeout(resolve, RECORDING_DELAY_HALF));
        console.log("half a second delay")
        stop()
    }

    const convertToNonReview = (event) => {
        console.log("change to recording state")
        setCurrentState({
            ...currentState,
            review: false
        })
    }

    const saveProgress = async (user_id, script_id, line) => {
        const line_to_update = (line >= 0) ? line : 0;
        await new Promise(
            async resolve => 
                await axios.post('/api/user/update_task_progress', {user_id: user_id, script_id: script_id, current_line: line_to_update})
            )
    }

    const nextLine = async (event) => {
        console.log("next line")
        var originalLineNumber = currentState.currentLine
        if (currentState.currentLine >= 0) {
            console.log("add current line: ", originalLineNumber + 1)
            setCurrentState({
                ...currentState,
                review: false,
                currentLine: originalLineNumber + 1
            })
        }

        new Promise(function(resolve, reject) {

            saveBlob()
            setTimeout(() => resolve(1), 1000); // (*)
          
          }).then(function(result) { // (**)
          
            setTimeout(() => 1000); // (*)
            return result * 2;
          
          }).then(function(result) { // (***)
          
            setCurrentState({
                ...currentState,
                audioData: null,
            })
            return result * 2;
          
          }).then(function(result) {
            // recorderControls.stopRecording()
            stopAudioRecorder(true);
            return result * 2;
          })
          .then(function(result) {
            start()
            return result * 2

          })
          .then(() => {
            saveProgress(accessCode, scriptID, currentState.currentLine)
          });

        // await new Promise(resolve => setTimeout(resolve, 3000))
    
    }

    const start = async (event) => {
        setCurrentState({
            ...currentState,
            currentLine: currentState.currentLine + 1,
            recordState: RecordState.START,
            review: false,
            audioData: null
        })
        
        recorderControls.startRecording()
    }

    const pause = (event) => {
        // console.log("Pause")
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

    const createFileName = () => {
        var fileName =  accessCode + "_script" + scriptID + "_line" + currentState.currentLine.toString().padStart(4, '0') + '.webm'
        return fileName;
    }

    const createFileNameWithLineNumber = (lineNumber) => {
        var fileName =  accessCode + "_script" + scriptID + "_line" + lineNumber.toString().padStart(4, '0')
        return fileName;
    }

    const saveBlob = async (event) => {

        setCheckBlob(null);
  
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
            })
        } catch (error) {
            openNotificationWithIcon('error', error)
        }

        // automatically download
        // var a = document.createElement("a");
        // document.body.appendChild(a);
        // a.style = "display: none";
        // var url = window.URL.createObjectURL(blob);
        // a.href = url;
        // a.download = fileName;
        // a.click();
        // window.URL.revokeObjectURL(url);
    };

    async function createBlobFromLocalPath(containerClient, blobName, localFileWithPath, uploadOptions){

        // create blob client from container client
        const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
    
        // upload file to blob storage
        await blockBlobClient.uploadFile(localFileWithPath, uploadOptions);
        console.log(`${blobName} succeeded`);
    }

    const onStop = (audioData) => {
        console.log('audioData', audioData)
        setCurrentState({
            // currentLine: currentState.currentLine,
            // recordState: currentState.recordState,
            ...currentState,
            audioData: audioData
        })
        ReviewPageRendering()
    }

    const ReviewPageRendering = () => {
        // console.log("review page rendering: ", currentState.review)
        if (currentState.review) {
            return <ReviewPage audioData={currentState.audioData}></ReviewPage>
        }
    }

    const AudioPlayerRendering = () => {
        return <AudioPlayer source={currentState.audioData}></AudioPlayer>
    }

    const UtteranceDisplayerRendering = () => {
        return <UtteranceDisplayer currentRecordState={recorderControls.isRecording} line={currentUtterances} user_id={accessCode} script_id={scriptID} current_line={currentState.currentLine}></UtteranceDisplayer>
    }

    const restart = async (event) => {
        // console.log("start recording after one second")
        // await new Promise(resolve => setTimeout(resolve, RECORDING_DELAY));

        setCurrentState({
            ...currentState,
            currentLine: currentState.currentLine,
            recordState: RecordState.START,
            review: false,
        })
        setCheckBlob(null);
        stopAudioRecorder(false);

        recorderControls.startRecording()
    }

    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        setCheckBlob(url);
      };

    const renderRecorder = () => {
        console.log("render recording utterance detail: ", currentUtteranceDetails)
        // console.log("current record state: ", currentState.recordState)
        return (
            // <div className='disable_all_clicks'>
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
              {/* <button onClick={start}>Start recording</button> */}
              {/* <button onClick={stop}>Stop recording</button> */}
              {<ScriptController previousLine={previousLine} nextLine={nextLine} start={start} stop={stop} pause={pause} restart={restart} review={review} nextContent={"Review"} reviewState={currentState.review} recordingState={currentState.recordState} currentLine={currentState.currentLine}></ScriptController>}
            </div>
          )
    }

    const renderRecordingModal = () => {
        return (
            <>
            <div className='utterance_display'>
                {UtteranceDisplayerRendering()}
            </div>
            <br/>
            <div className='center'>
                {renderRecorder()}
            </div>
            </>
        )
    }

    const handleComplete = async (event) => {
        event.preventDefault();

        await axios.post("/api/user/mark_task_complete", {
            user_id: accessCode,
            script_id: scriptID
        })
        // .then((res) => res.json())
        .then((user_search_result) => {
            openNotificationWithIcon('success', "Script #" + scriptID + " complete!")
        });

        // await createCSVReceipt();

        await axios.post("/api/script/unassign_task", {
            user_id: accessCode,
            script_id: scriptID
        })
        // .then((res) => res.json())
        .then((user_search_result) => {
            openNotificationWithIcon('success', "Script #" + scriptID + " unassigned! Redirecting to dashboard.")
        })
        .then(() => {
            navigate('/dashboard', {
                state: {
                    accessCode: accessCode
                }
            })
            window.location.reload()
        })
    }

    const startModule = async () => {
        setCurrentState({...currentState, startState: true})

        await createCSVReceipt();
    }

    const formatCSVReceiptTitle = (scriptID, userID) => {
        return "receipt_" + userID + "_#" + scriptID;
    }

    const createCSVReceipt = async () => {
        // format : accessCode | scriptID | line number | utterance | file name | detail

        const script_details = [
            "field1",
            "field2",
            "field3",
            "field4",
            "field5",
            "field6",
            "field7"
        ];
        
        // prepare recording file names and username
        var data = []
        console.log("total lines: ", currentState.totalLines)

        for (var i = 1; i < currentState.totalLines; i++) {
            var temp = []
            console.log("details: ", currentUtteranceDetails)
            console.log("current line: ", i)
            var utterance_detail = currentUtteranceDetails[i]

            console.log("utterance_detail: ", utterance_detail)

            temp.push(accessCode) // access code
            temp.push(scriptID) // script id
            temp.push(i.toString()) // line number
            temp.push(`"${currentUtterances[i]}"`) // utterance
            temp.push(createFileNameWithLineNumber(i)) // recording file name

            for (const script_detail of script_details) {
                temp.push(utterance_detail[script_detail].toString())
            }
            data.push(temp)
        }

        var rows = ["access code", "script ID", "line number", "sentence", "file name", ...script_details];

        create_csv_receipt(data, rows, formatCSVReceiptTitle(scriptID, accessCode));
    }

    const renderComplete = () => {
        return (
            <div>
                <Button onClick={handleComplete}>Exit</Button>
            </div>
        )
    }

    if (!isFetched) {
        return <div className="App">Loading...</div>;
    }

    if (!currentState.startState) {
        return (
        <div className='vertical_center'>
            <div className='large_font_blue_center'>
            You are about to start script # {scriptID}.
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
    
    return (
        <div>
            {renderProgressBar({current: currentState.currentLine, total: currentState.totalLines})}

            {currentState.totalLines !== currentState.currentLine && renderRecordingModal()}
            {currentState.totalLines === currentState.currentLine && renderComplete()}

        </div>
    );

}

export default RecordingModal