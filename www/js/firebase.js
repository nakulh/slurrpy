/*jshint esversion: 6 */
const firebase = require("firebase");
const restaurant = 'superUsers/superUser1/restaurant1/';
//const {ipcRenderer} = require('electron');
const config = {
    apiKey: "AIzaSyCjx4zRVXcvY12kTs1gDk-Qaaz33rjJPm4",
    authDomain: "slurrpy-1f1a0.firebaseapp.com",
    databaseURL: "https://slurrpy-1f1a0.firebaseio.com",
    projectId: "slurrpy-1f1a0",
    storageBucket: "slurrpy-1f1a0.appspot.com",
    messagingSenderId: "632838959951"
};
firebase.initializeApp(config);
var isOnline = true;
var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    console.log("connected");
    isOnline = true;
  } else {
    console.log("not connected");
    isOnline = false;
  }
});


var cloud = firebase.database();
cloud.do = {};

cloud.do.getUsers = ()=>{
  return new Promise((res, rej)=>{
    if(!isOnline){
      console.log('OFFLINE');
      rej();
    }
    cloud.ref(restaurant + "workers").once('value').then((snap)=>{
      workers = snap.val();
      res(workers);
    });
  });
};
window.cloud = cloud;
