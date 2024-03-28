// Give your service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAawNBBBRIkCbRzbs4Sxu5-O_M_shnW0Ok",
  authDomain: "uniswap-418221.firebaseapp.com",
  projectId: "uniswap-418221",
  storageBucket: "uniswap-418221.appspot.com",
  messagingSenderId: "84838878723",
  appId: "1:84838878723:web:b5dfbaf9ef13e213384836",
  measurementId: "G-SWGZLGYCE1"
});

const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received backgrounad message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
