/*jshint esversion: 6 */
const Datastore = require('nedb'),
users = new Datastore({ filename: 'data/users.db', autoload: true });
menu = new Datastore({ filename: 'data/menu.db', autoload: true });
tables = new Datastore({ filename: 'data/tables.db', autoload: true });
customers = new Datastore({ filename: 'data/customers.db', autoload: true });
kitchen = new Datastore({ filename: 'data/kitchen.db', autoload: true });
console.log("DB");

const db = {
  users: users,
  menu: menu,
  tables: tables,
  customers: customers,
  kitchen: kitchen
};

db.do  = {};
db.do.login = (username, password) => {
  return new Promise((resolve, reject) => {
    db.users.find({ username: username }, function (err, docs) {
      if(docs.length > 0 && docs[0].password == password){
        resolve();
      }
      else{
        reject();
      }
    });
  });
};
db.do.syncUsers = (users) => {
  return new Promise((resolve, reject) => {
    db.users.remove({}, { multi: true }, function (err, numRemoved) {
      db.users.insert(users, (err, newDoc) => {
        if(!err)
          resolve();
        else {
          reject();
        }
      });
    });
  });
};

window.db = db;
