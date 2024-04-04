import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAawNBBBRIkCbRzbs4Sxu5-O_M_shnW0Ok",
  authDomain: "uniswap-418221.firebaseapp.com",
  projectId: "uniswap-418221",
  storageBucket: "uniswap-418221.appspot.com",
  messagingSenderId: "84838878723",
  appId: "1:84838878723:web:ea20d2112707c489384836",
  measurementId: "G-FYFKW26X8K"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

// Handle incoming background messages. 
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.PNG' 
  };

  // Show the notification
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
