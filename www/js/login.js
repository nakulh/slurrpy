/*jshint esversion: 6 */
var usersSynced = false;

setTimeout(()=>{
  cloud.do.getUsers().then((workers)=>{
    w = [];
    for(var worker in workers){
      w.push(workers[worker]);
    }
    console.log(w);
    db.do.syncUsers(w).then(()=>{
      console.log('users synced');
      usersSynced = true;
    });
  }).catch(()=>{
    usersSynced = true;
    console.log('retrieving users failed');
  });
}, 4000);


const $ = require('jquery');
$("#submit").click(function(e){
  e.preventDefault();
  username = $('#username').val();
  password = $('#password').val();
  if(usersSynced){
    db.do.login(username, password).then(()=>{
      console.log('logged in');
      document.location.href = '../views/pos.html';
    }).catch(()=>{
      console.log('incorrect credentials');
    });
  }
});
