import React, {useState, useEffect} from 'react'
import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import LoginForm from './components/LoginForm'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import RecordingModal from './components/RecordingModal'
import AdminDashboard from './components/admin/AdminDashboard'

const api = axios.create({
  baseURL: `http://localhost:3001/`
})

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
            <Route path="/admin" element={<AdminDashboard/>}/>
          {/* </Switch> */}
          </Routes>
        </div>
      </div> 
    // </Router>
  )
}

export default App