import React, { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm';
import RecordingModal from '../components/RecordingModal';
import "../../src/App.css"
import Logo from "./../images/logo2.png"
import SOM_Logo from "./../images/rounded_jhu_som_logo_transparent_white.png"
import JHU_logo from "../images/wse_logo.png"

function Home() {

  const [user, setUser] = useState({accessCode: ""})
  const [error, setError] = useState("");

  const Login = details => {
    console.log("details: ", details.accessCode);

    setUser({
      accessCode: details.accessCode
    });

    console.log("user: ", user);
  }

  const renderLoginForm = () => {
    if (user.accessCode === "") {
      return <LoginForm Login={Login} error={error}></LoginForm>
    } else {
      return (<><div>Welcome, accessCode: {user.accessCode}</div></>)
    }
  }

  return (
    <div className="welcome_page">
      <div className="top">
        HermeSpeech Recorder
      </div>
      <div className='center'>
        {renderLoginForm()}
      </div>
      <div className='bottom'>
        <img className='jhu_som_logo' src={SOM_Logo} alt="Johns Hopkins School of Medicine"></img>
        <img className='jhu_wse_logo' src={JHU_logo} alt="Johns Hopkins School of Medicine"></img>
      </div>

    </div> 
  )
}

export default Home