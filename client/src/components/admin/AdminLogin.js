import React, { useState } from 'react'
import "../../App.css"
import SOM_Logo from "../../images/rounded_jhu_som_logo_transparent_white.png"
import JHU_logo from "../../images/wse_logo.png"
import { Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import axios from 'fetch';
import { notification } from 'antd';

function AdminLogin() {

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, msg) => {
    api[type]({
      message: type,
      description: msg,
    });
};

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    const res = await axios.post('/api/auth/admin/login', {
      username,
      password
    })

    if(res.status !== 200){
      openNotificationWithIcon('error', res.data.message)
      return;
    }

    navigate("/admin")
  }

  return (
    <div className="welcome_page">
      <div className="top">
        HermeSpeech Admin
      </div>
      <div className='center'>
        <form onSubmit={handleSubmit}>
              <div>
                  <h1 className='access_code'>
                      Username
                      <input
                        style={{position: 'relative', left: '10px'}}
                        id='username'
                        type='text'
                      />
                  </h1>
              </div>
              <div>
                  <h1 className='access_code'>
                      Password
                      <input
                        style={{position: 'relative', left: '13px'}}
                        id='password'
                        type='password'
                      />
                  </h1>
              </div>

              <br/>
              
              <div className="login_button">
                  <Button type="submit" className="btn btn-primary">
                      Submit
                  </Button>
              </div>
          </form>
      </div>
      <div className='bottom'>
        <img className='jhu_som_logo' src={SOM_Logo} alt="Johns Hopkins School of Medicine"></img>
        <img className='jhu_wse_logo' src={JHU_logo} alt="Johns Hopkins School of Medicine"></img>
      </div>

    </div> 
  )
}

export default AdminLogin