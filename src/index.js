import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAbLWVAzrxJgTuWnTuwTt7fIPK59qkaMBM",
  authDomain: "qnotes-5106e.firebaseapp.com",
  databaseURL: "https://qnotes-5106e.firebaseio.com",
  projectId: "qnotes-5106e",
  storageBucket: "qnotes-5106e.appspot.com",
  messagingSenderId: "921594280173",
  appId: "1:921594280173:web:2bb3490717e6ec118974e4",
  measurementId: "G-HJWV8XQSDN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.storage();
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('qnote-container')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
