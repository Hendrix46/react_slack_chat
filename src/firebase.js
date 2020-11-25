import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/analytics';

var firebaseConfig = {
    apiKey: "AIzaSyDlG9nGXEyQpe3qTwvhd2jeIk_LCrIfGlY",
    authDomain: "react-slack-chat-e6d63.firebaseapp.com",
    databaseURL: "https://react-slack-chat-e6d63.firebaseio.com",
    projectId: "react-slack-chat-e6d63",
    storageBucket: "react-slack-chat-e6d63.appspot.com",
    messagingSenderId: "21504603145",
    appId: "1:21504603145:web:5d6aed3de0e6990b38b4d8",
    measurementId: "G-DCNEZ46L15"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


export default firebase;