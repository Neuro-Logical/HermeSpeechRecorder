import React, {useState, useEffect} from 'react'
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import LoginForm from './components/LoginForm'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import RecordingModal from './components/RecordingModal'
import RecordingMedia from './components/RecordingMedia'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminLogin from './components/admin/AdminLogin'
import AssignScriptsSpecificUserModal from './components/admin/AssignScriptsSpecificUserModal'
import AssignScriptMultipleUsersModal from './components/admin/AssignScriptMultipleUsersModal'
import UnassignScriptSpecificUserModal from './components/admin/UnassignScriptSpecificUserModal'
import ReactAudioVoiceRecorder from './components/testing/react-audio-voice-recorder/ReactAudioVoiceRecorder'

function App() {

  return (
    // <Router>
      <div className='App'>
        <div className='Content'>
          {/* <Switch> */}
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/dashboard" element={<Dashboard />}/>
            <Route path="/module" element={<RecordingModal/>}/>
            <Route path="/record" element={<RecordingMedia/>}/>
            <Route path="/assign-script-specific" element={<AssignScriptsSpecificUserModal/>}/>
            <Route path="/unassign_script_specific_user" element={<UnassignScriptSpecificUserModal/>}/>
            <Route path="/assign-script-multiple-users" element={<AssignScriptMultipleUsersModal/>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/react_audio_voice_recorder" element={<ReactAudioVoiceRecorder/>}/>
          {/* </Switch> */}
          </Routes>
        </div>
      </div> 
    // </Router>
  )
}

export default App