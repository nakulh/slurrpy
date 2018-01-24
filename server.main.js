/*jshint esversion: 6 */
const express = require('express');
const app = express();
const {ipcMain} = require('electron');
//var http = require('http').Server(app);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
server = app.listen(8000, () => {
  console.log("App started on port 8000");
});
var io = require('socket.io')(server);
function createServer(app){
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('itemCooked', function(item){
      console.log(item);
      app.itemReady(item);
    });
  });
}
ipcMain.on('addItems', (event, items) => {
  console.log(items);
  io.emit('addItems', items);
  event.returnValue = 'items added';
});
module.exports = createServer;
