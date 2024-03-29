// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var apiKey = process.env.REACT_APP_apiKey
var authDomain = process.env.REACT_APP_authDomain
var projectId = process.env.REACT_APP_projectId
var storageBucket = process.env.REACT_APP_storageBucket
var messagingSenderId = process.env.REACT_APP_messagingSenderId
var appId = process.env.REACT_APP_appId
var measurementId = process.env.REACT_APP_measurementId

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
