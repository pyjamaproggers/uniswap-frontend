import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactGA from "react-ga4";

ReactGA.initialize(process.env.REACT_APP_measurementId);
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('./firebase-messaging-sw.js').then(function (registration) {
//             console.log('Service Worker registered successfully with scope: ', registration.scope);
//         }, function (err) {
//             console.log('Service Worker registration failed: ', err);
//         });
//     });
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID}>
        <App />
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
