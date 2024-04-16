import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './store'; // Import the Redux store you've configured
import ReactGA from "react-ga4";
import { ConfigProvider } from "antd";

ReactGA.initialize(process.env.REACT_APP_measurementId);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID}>
            <Provider store={store}> {/* Wrap App with Provider and pass the store */}
                <App />
            </Provider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);

reportWebVitals();
