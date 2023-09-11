import React from 'react'
import { useState, useEffect } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const ExampleComponent = () => {

    const accessCode = "test1"
    const scriptID = "script#1"

    const recorderControls = useAudioRecorder()
    const [currentState, setCurrentState] = useState({currentLine: 0, recordState: null, audioData: null, review: false, totalLines: 0, startState: false})

    // useEffect(() => {
    //   if (!recorderControls.recordingBlob) return;
  
    //   // recordingBlob will be present at this point after 'stopRecording' has been called
    // }, [recorderControls.recordingBlob])

    const createFileName = () => {
      var fileName =  accessCode + "_script" + scriptID + "_line" + currentState.currentLine.toString().padStart(4, '0')
      return fileName;
    }

  const createFileNameWithLineNumber = (lineNumber) => {
      var fileName =  accessCode + "_script" + scriptID + "_line" + lineNumber.toString().padStart(4, '0')
      return fileName;
  }

    const saveBlob = async (event) => {
      // console.log("currentState.audioData: ", currentState.audioData)
      // var blob = currentState.audioData.blob
      console.log("current blob: ", recorderControls.recordingBlob)

      var blob = recorderControls.recordingBlob
      var fileName = createFileName()
      // console.log("file name: ", fileName);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
  
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
  };

    const addAudioElement = (blob) => {
      const url = URL.createObjectURL(blob);
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = true;
      document.body.appendChild(audio);
  };

  return (
    // <div className='disable_all_clicks'>
    <div>
      <AudioRecorder 
        onRecordingComplete={saveBlob}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        // downloadOnSavePress={true}
        downloadFileExtension="mp3"
        recorderControls={recorderControls}
        classes={{
          AudioRecorderStartSaveClass: 'display_none',
          AudioRecorderPauseResumeClass: 'display_none',
          AudioRecorderDiscardClass: 'visibility_hidden'
        }}
      />
      {/* <button onClick={recorderControls.stopRecording}>Stop recording</button> */}
      <button onClick={recorderControls.startRecording}>Start recording</button>
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
    </div>
  )
}

function ReactAudioVoiceRecorder() {
  return (
    <div>
      <div>ReactAudioVoiceRecorder</div>
      <ExampleComponent/>
    </div>
  )
}

export default ReactAudioVoiceRecorder