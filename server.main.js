/*jshint esversion: 6 */
const express = require('express');
const server = express();

function createServer(app){
  server.get('/', (req, res) => res.send("software online"));
  server.get('/getKitchenList', (req, res) => {
    console.log("get /getKitchenList");
  });
  server.get('/finish/:table-:dish-:quantity', (req, res) => {
    app.cookDish(req.params.table, req.params.dish, req.params.quantity);
    console.log("get /finish/:table-:dish-:quantity");
    res.send("cooked");
  });
  server.listen(8000, () => {
    console.log("App started on port 8000");
  });
}
module.exports = createServer;
