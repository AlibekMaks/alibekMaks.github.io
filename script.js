var firebaseConfig = {
    apiKey: "AIzaSyDbuypsaW8KEyoEKbID2AM8NljFJEg0lO0",
    authDomain: "platon-test.firebaseapp.com",
    databaseURL: "https://platon-test-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "platon-test",
    storageBucket: "platon-test.appspot.com",
    messagingSenderId: "292412936228",
    appId: "1:292412936228:web:f17c04cd1d5a3b7f6c48b1",
    // measurementId: "G-SY7X2QNMZW"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  var bt_register = $('#register');

  const messaging = firebase.messaging();
  messaging.requestPermission()
  .then(function() {
    console.log('have permission');
    return messaging.getToken();
  })
  .then(function(token) {
      console.log(token)
  })
  .catch(function(err) {
    console.log('error occured' + err);
  });


  messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);

    // регистрируем пустой ServiceWorker каждый раз
    navigator.serviceWorker.register('firebase-messaging-sw.js');

    // запрашиваем права на показ уведомлений если еще не получили их
    Notification.requestPermission(function(result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                // теперь мы можем показать уведомление
                return registration.showNotification(payload.notification.title, payload.notification);
            }).catch(function(error) {
                console.log('ServiceWorker registration failed', error);
            });
        }
    });
});



// if (
//     'Notification' in window &&
//     'serviceWorker' in navigator &&
//     'localStorage' in window &&
//     'fetch' in window &&
//     'postMessage' in window
// ){

//     var messaging = firebase.messaging();

//     if (Notification.permission === 'granted') {
//         getToken();
//     }

//     bt_register.on('click', function() {
//         getToken();
//     });

    
//     messaging.onMessage(function(payload) {
//         console.log('Message received', payload);
//         // info.show();
//         // info_message
//         //     .text('')
//         //     .append('<strong>'+payload.data.title+'</strong>')
//         //     .append('<em>'+payload.data.body+'</em>')
//         // ;

//         // register fake ServiceWorker for show notification on mobile devices
//         navigator.serviceWorker.register('firebase-messaging-sw.js')
//             then((registration) => {
//                 messaging.useServiceWorker(registration);});

//         Notification.requestPermission(function(permission) {
//             if (permission === 'granted') {
//                 navigator.serviceWorker.ready.then(function(registration) {
//                     // Copy data object to get parameters in the click handler
//                     payload.data.data = JSON.parse(JSON.stringify(payload.data));

//                     registration.showNotification(payload.data.title, payload.data);
//                 }).catch(function(error) {
//                     // registration failed :(
//                     showError('ServiceWorker registration failed', error);
//                 });
//             }
//         });
//     });
// }




function getToken() {
    messaging.requestPermission()
        .then(function() {
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            messaging.getToken()
                .then(function(currentToken) {

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one')
                        
                        
                        setTokenSentToServer(false);
                    }
                })
                .catch(function(error) {
                    console.log('An error occurred while retrieving token', error);
                    
                    setTokenSentToServer(false);
                });
        })
        .catch(function(error) {
            console.log('Unable to get permission to notify', error);
        });
}

    // Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to server...');
        // send current token to server
        //$.post(url, {token: currentToken});
        setTokenSentToServer(currentToken);
    } else {
        console.log('Token already sent to server so won\'t send it again unless it changes');
        console.log(currentToken);
    }
}

function isTokenSentToServer(currentToken) {
        return window.localStorage.getItem('sentFirebaseMessagingToken') === currentToken;
}
    
function setTokenSentToServer(currentToken) {
    if (currentToken) {
        window.localStorage.setItem('sentFirebaseMessagingToken', currentToken);
    } else {
        window.localStorage.removeItem('sentFirebaseMessagingToken');
    }
}