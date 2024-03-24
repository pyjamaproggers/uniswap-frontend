import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
function App() {

    function handleCallbackresponse(response) {
        var userObject = jwt_decode(response.credential)
        document.getElementById("GoogleButton").hidden = true;
        console.log(userObject)
    }

    useEffect(() => {
        window.setTimeout(()=>{
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENTID,
                callback: handleCallbackresponse
            });
            
            window.google.accounts.id.renderButton(
                document.getElementById("GoogleButton"),
                { theme: 'outlined', size: 'large', shape: 'pill',}
            ); 
        }, 2000)

    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <div className="GoogleButton" id='GoogleButton'></div>
        </div>
    );
}

export default App;
