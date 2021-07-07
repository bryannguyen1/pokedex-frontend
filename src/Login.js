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

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    const [hasToken, setHasToken] = useState(false)
    const [token, setToken] = useState('')

    const { username, email, password } = formData
    const { loginUsername, loginPassword } = loginData

    function onChangeFormData(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    function onChangeLoginData(e) {
        setLoginData({...loginData, [e.target.name]: e.target.value})
    }

    function onSubmitRegister(e) {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( formData )
        }


        fetch("https://pokedex-backend02.herokuapp.com/api/register/", requestOptions)
        .then(response => response.json())
        .then(function(data) {

        })
    }

    function onSubmitLogin(e) {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( loginData )
        }

        fetch("https://pokedex-backend02.herokuapp.com/api/login/", requestOptions)
        .then(response => response.json())
        .then(function(data){
            if (data.token !== undefined) {
                setHasToken(true)
                setToken(data.token)
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
                        <input placeholder={'Username'} name='username' value={loginUsername} onChange={onChangeLoginData} />
                        <input placeholder={'Password'} name='password' value={loginPassword} onChange={onChangeLoginData} />
                        <button type="submit">Login</button>
                    </form>
                </div>
            }
            {hasToken && <Pokedex username={loginData.username} password={loginData.password} token={token} loggedIn={true}/>}
        </div>
    )
}

export default Login;