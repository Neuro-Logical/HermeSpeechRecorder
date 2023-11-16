import React, { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm';
import RecordingModal from '../components/RecordingModal';
import "../../src/App.css"
import Logo from "./../images/placeholder_logo.png"

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
        <img className="logo" src={Logo} alt="placeholder_logo"></img>
      </div>
      <div className='center'>
        {renderLoginForm()}
      </div>
      <div className='bottom'>
        {/* put your logo of choice here for affiliation and more */}
      </div>

    </div> 
  )
}

export default Home