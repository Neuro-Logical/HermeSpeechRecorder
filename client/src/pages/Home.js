import React, { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm';
import RecordingModal from '../components/RecordingModal';
import "../../src/App.css"
import Logo from "./../images/logo2.png"
import SOM_Logo from "./../images/rounded_jhu_som_logo_transparent_white.png"

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
    <div className="general_background">
      <br></br>
      <div className="center">
        <img className="logo" src={Logo} alt="logo1"></img>
      </div>
      <div>
        <img className='jhu_som_logo' src={SOM_Logo} alt="Johns Hopkins School of Medicine"></img>
      </div>
      <div className='right'>
        {renderLoginForm()}
      </div>
    </div>
  )
}

export default Home