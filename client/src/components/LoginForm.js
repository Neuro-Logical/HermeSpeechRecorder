import React, { useState } from 'react'
import axios from 'fetch'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function LoginForm({Login, error}) {

    const [loginDetails, setLoginDetails] = useState({accessCode: ""});

    const navigate = useNavigate();

    const handleAccessCodeChange = (event) => {
        setLoginDetails({
            accessCode: event.target.value
        })
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        axios.post("/api/user/get_user_by_id", {user_id: loginDetails.accessCode})
        // .then((res) => res.json()) 
        .then((user_search_result) => {
            if (user_search_result === null) {
                alert("incorrect credentials");
                return
            } else {
                Login(loginDetails);
                navigate('/dashboard', {
                    state: {
                        accessCode: loginDetails.accessCode
                    }
                })
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className='access_code'>
                    Access Code:
                    <input
                        type='text'
                        value={loginDetails.accessCode}
                        onChange={handleAccessCodeChange}>
                    </input>
                </h1>
            </div>

            <br/>
            
            <div class="login_button">
                <Button type="submit" class="btn btn-primary">
                    Submit
                </Button>
            </div>
        </form>
    )
}

export default LoginForm