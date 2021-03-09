importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDbuypsaW8KEyoEKbID2AM8NljFJEg0lO0",
    authDomain: "platon-test.firebaseapp.com",
    databaseURL: "https://platon-test-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "platon-test",
    storageBucket: "platon-test.appspot.com",
    messagingSenderId: "292412936228",
    appId: "1:292412936228:web:f17c04cd1d5a3b7f6c48b1"
});

const messaging = firebase.messaging();

// Customize notification handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Handling background message', payload);

  // Copy data object to get parameters in the click handler
  payload.data.data = JSON.parse(JSON.stringify(payload.data));

  return self.registration.showNotification(payload.data.title, payload.data);
});


