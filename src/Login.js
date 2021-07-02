import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Login.css';
import Pokedex from "./Pokedex";

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [hasToken, setHasToken] = useState(false)

    const { username, email, password } = formData

    function onChangeFormData(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    function onSubmitRegister(e) {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( formData )
        }


        fetch("http://localhost:8000/api/register/", requestOptions)
        .then(response => response.json())
        .then(function(data) {

        })
    }

    function onSubmitLogin(e) {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {username: username, password: password} )
        }

        fetch("http://localhost:8000/api/login/", requestOptions)
        .then(response => response.json())
        .then(function(data){
            if (data.token !== undefined) {
                setHasToken(true)
            }
        })
    }

    return (
        <div>
            {!hasToken &&
                <div>
                    <h1>Register</h1>
                    <form onSubmit={onSubmitRegister} className="auth-form">
                        <input placeholder={'Username'} name='username' value={username} onChange={onChangeFormData} />
                        <input placeholder={'Email'} name='email' value={email} onChange={onChangeFormData} />
                        <input placeholder={'Password'} name='password' value={password} onChange={onChangeFormData} />
                        <button type="submit">Register</button>
                    </form>
                    <h1>Login</h1>
                    <form onSubmit={onSubmitLogin} className="auth-form">
                        <input placeholder={'Username'} name='username' value={username} onChange={onChangeFormData} />
                        <input placeholder={'Password'} name='password' value={password} onChange={onChangeFormData} />
                        <button type="submit">Login</button>
                    </form>
                </div>
            }
            {hasToken && <Pokedex username={username} password={password}/>}
        </div>
    )
}

export default Login;