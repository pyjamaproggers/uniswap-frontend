// Use importScripts to load Firebase JS SDK
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAawNBBBRIkCbRzbs4Sxu5-O_M_shnW0Ok",
  authDomain: "uniswap-418221.firebaseapp.com",
  projectId: "uniswap-418221",
  storageBucket: "uniswap-418221.appspot.com",
  messagingSenderId: "84838878723",
  appId: "1:84838878723:web:ea20d2112707c489384836",
  measurementId: "G-FYFKW26X8K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so it can handle background messages
const messaging = firebase.messaging();

// Handle incoming background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/logo.PNG'
//   };

//   // Show the notification
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
