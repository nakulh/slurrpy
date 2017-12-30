/*jshint esversion: 6 */
const Datastore = require('nedb');
console.log("DB");
const db = {
  users: new Datastore({ filename: 'data/users.db', autoload: true }),
  menu: new Datastore({ filename: 'data/menu.db', autoload: true }),
  tables: new Datastore({ filename: 'data/tables.db', autoload: true }),
  customers: new Datastore({ filename: 'data/customers.db', autoload: true }),
  kitchen: new Datastore({ filename: 'data/kitchen.db', autoload: true }),
  foodCategories: new Datastore({ filename: 'data/foodCategories.db', autoload: true })
};
/*db.tables.insert([{number: 1, firstName: "", lastName: "", count: 0, order: [], occupiedTimestamp: null},
                {number: 2, firstName: "", lastName: "", count: 0, order: [], occupiedTimestamp: null},
                {number: 3, firstName: "", lastName: "", count: 0, order: [], occupiedTimestamp: null},], (err, newDoc)=>{
                  console.log(err);
                  console.log(newDoc);
                });*/

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

db.do.getCategories = () => {
  return new Promise((res, rej) => {
    db.foodCategories.find({categories: { $exists: true}}, (err, doc)=>{
      if(err){
        console.log(err);
        rej();
      }
      console.log("got categories");
      res(doc[0].categories);
    });
  });
};

db.do.getAllMenuItems = () => {
  return new Promise((res, rej) => {
    db.menu.find({name: {$exists: true}}, (err, docs) => {
      if(err){
        console.log(err);
        rej();
      }
      console.log("got whole menu");
      res(docs);
    });
  });
};

db.do.getMenuFromCategory = (category) => {
  return new Promise((res, rej) => {
    db.menu.find({category: category}, (err, docs) => {
      if(err){
        console.log(err);
        rej();
      }
      console.log("got menu from category");
      res(docs);
    });
  });
};

db.do.addMenuItem = (item) => {
  return new Promise((res, rej)=>{
    db.menu.find({name: item.name}, (err, docs) => {
      if(err){
        console.log(err);
        rej();
      }
      else if(docs.length){
        rej("Item already present " + item.name);
      }
      else{
        db.menu.insert(item, (err, newDoc) => {
          if(err){
            console.log(err);
            rej();
          }
          res("Item Added");
        });
      }
    });
  });
};

db.do.updateMenuItem = (item) => {
  return new Promise((res, rej) => {
    db.menu.update({name: item.name}, { $set:{ category: item.category, price: item.price, inStock: item.inStock}}, {}, (err, numUpdated)=>{
      if(err){
        console.log(err);
        rej();
      }
      console.log("update Count: " + numUpdated);
      res("Updated");
    });
  });
};

db.do.seatCustomer = (customer, num) => {
  return new Promise((res, rej)=>{
    db.tables.update({number: num}, {$set: {firstName: customer.firstName, lastName: customer.lastName, email: customer.email, count: customer.count,
    occupiedTimestamp: new Date(), order: []}}, {}, (err, c) => {
      if(err){
        console.log(err);
        rej();
      }
      console.log("update Count: " + c);
      res("Customer Seated");
    });
  });
};

db.do.unseatCustomer = (num, comments) => {
  return new Promise((res, rej) => {
    db.tables.find({number: num}, (err, doc) => {
      if(err){
        console.log(err);
      }
      var customer = doc[0];
      customer.unseatTimestamp = new Date();
      customer.comments = comments;
      db.tables.update({number: num}, {$set: {firstName: "", lastName: "", count: 0, order: [], occupiedTimestamp: null, email: ""}}, {}, (err, c)=>{
        if(err){
          console.log(err);
          rej();
        }
        console.log("update Count: " + c);
        db.customers.insert(customer, (err, newDoc) => {
          if(err){
            console.log(err);
          }
          console.log(newDoc);
          res("Customer Unseated");
        });
      });
    });
  });
};

db.do.addOrder = (order, quantity, modifier, table) => {
  order.modifiers = modifier;
  order.quantity = quantity;
  order.sentToKitchen = false;
  return new Promise((res, rej) => {
      db.tables.update({number: table}, {$push: { order: order}}, {}, (err, c) => {
        if(err){
          console.log(err);
          rej();
        }
        console.log("update Count: " + c);
        res("order added");
      });
  });
};
window.db = db;
