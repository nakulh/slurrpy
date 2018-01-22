/*jshint esversion: 6 */
const Datastore = require('nedb');
console.log("DB");
const db = {
  users: new Datastore({ filename: 'data/users.db', autoload: true }),
  menu: new Datastore({ filename: 'data/menu.db', autoload: true }),
  tables: new Datastore({ filename: 'data/tables.db', autoload: true }),
  walkins: new Datastore({ filename: 'data/walkins.db', autoload: true }), //same as tables
  customers: new Datastore({ filename: 'data/customers.db', autoload: true }),
  kitchen: new Datastore({ filename: 'data/kitchen.db', autoload: true }),
  foodCategories: new Datastore({ filename: 'data/foodCategories.db', autoload: true }),
  orderHistory: new Datastore({ filename: 'data/orderHistory.db', autoload: true })
};
/*db.orderHistory.insert([{items: [{"name":"Paneer masala","price":"600", "quantity": 1},{"name": "daya", "price": 300, "quantity": 2}], inTime: new Date('January 30 2018 12:30'), outTime: new Date('January 30 2018 13:30')},
                        {items: [{"name":"Paneer masala","price":"600", "quantity": 4},{"name": "daya", "price": 300, "quantity": 1}], inTime: new Date('December 30 2017 12:30'), outTime: new Date('December 30 2017 15:30')},
                        {items: [{"name":"Paneer masala","price":"600", "quantity": 1},{"name": "daya", "price": 300, "quantity": 1}], inTime: new Date('November 30 2017 12:30'), outTime: new Date('November 30 2017 16:30')}], (err, newDoc)=>{
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

db.do.addCategory = (category) => {
  return new Promise((res, rej) => {
    db.foodCategories.update({categories: { $exists: true}}, {$push: {categories: category}}, {}, (err, numUpdated)=>{
      if(err){
        console.log(err);
        rej();
      }
      console.log("update count " + numUpdated);
      res();
    });
  });
};

db.do.deleteCategory = (category) => {
  return new Promise((res, rej) => {
    db.do.getCategories().then((categories)=>{
      newCategories = [];
      for(let x = 0; x < categories.length; x++){
        if(categories[x] != category){
          newCategories.push(categories[x]);
        }
      }
      console.log("new category list");
      console.log(newCategories);
      db.foodCategories.update({categories: { $exists: true}}, {$set: {categories: newCategories}}, {}, (err, numUpdated)=>{
        if(err){
          console.log(err);
          rej();
        }
        db.menu.remove({category: category}, {multi: true}, (err, numRemoved) => {
          console.log("deleted items " + numRemoved);
        });
        console.log("update count " + numUpdated);
        res("deleted category");
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
          res(newDoc._id);
        });
      }
    });
  });
};

db.do.editMenuItem = (item, id) => {
  return new Promise((res, rej)=>{
      db.menu.update({_id: id}, {$set: {name: item.name, price: item.price, shortName: item.shortName}}, {}, (err, numUpdated) => {
        if(err){
          console.log(err);
          rej();
        }
        console.log("update Count: " + numUpdated);
        res("Updated");
      });
  });
};

db.do.deleteMenuItem = (id) => {
  return new Promise((res, rej) => {
    db.menu.remove({_id: id}, {}, (err, numRemoved)=>{
      if(err){
        console.log(err);
        rej();
      }
      console.log("remove Count: " + numRemoved);
      res("Removed");
    });
  });
};

db.do.toggleItemServing = (id, isServing) => {
  console.log(id);
  console.log(isServing);
  return new Promise((res, rej) => {
    db.menu.update({_id: id}, {$set: {inStock: isServing}}, {}, (err, numUpdated)=>{
      if(err){
        console.log(err);
        rej();
      }
      console.log("update Count: " + numUpdated);
      res("updated");
    });
  });
};

db.do.seatCustomer = (customer, num) => {
  console.log(customer);
  console.log(num);
  return new Promise((res, rej)=>{
    db.tables.update({number: parseInt(num)}, {$set: {firstName: customer.firstName, lastName: customer.lastName, email: customer.email, count: customer.count,
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

db.do.walkinCustomer = (customer, num) =>{
  return new Promise((res, rej)=>{
    db.walkins.insert({number: parseInt(num), firstName: customer.firstName, lastName: customer.lastName, email: customer.email, count: customer.count,
    occupiedTimestamp: new Date(), order: []}, (err, d) => {
      if(err){
        console.log(err);
        rej();
      }
      console.log("new doc " + d);
      res("Customer Walkedin");
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

db.do.getTablesStatus = () => {
  return new Promise((res, rej) => {
    db.tables.find({ number: {$exists: true}}, (err, docs) => {
      if(err){
        console.log(err);
        rej();
      }
      console.log("got all tables");
      console.log(docs);
      res(docs);
    });
  });
};

db.do.getWalkinsStatus = () => {
  return new Promise((res, rej) => {
    db.walkins.find({ number: {$exists: true}}, (err, docs) => {
      if(err){
        console.log(err);
        rej();
      }
      console.log("got all walkins");
      console.log(docs);
      res(docs);
    });
  });
};

db.do.addOrder = (order, quantity, modifier, table) => {
  order.modifiers = modifier;
  order.quantity = quantity;
  order.sentToKitchen = false;
  return new Promise((res, rej) => {
      db.tables.update({number: parseInt(table)}, {$push: { order: order}}, {}, (err, c) => {
        if(err){
          console.log(err);
          rej();
        }
        console.log("update Count: " + c);
        res("order added");
      });
  });
};

db.do.resetOrderList = (order, tableNumber) => {
  return new Promise((res, rej) => {
    db.tables.update({number: parseInt(tableNumber)}, {$set: {order: order}}, {}, (err, c) =>{
      if(err){
        console.log(err);
        rej();
      }
      console.log("update Count: " + c);
      res("order reset");
    });
  });
};

db.do.getOrderHistory = () => {
  return new Promise((res, rej) => {
    db.orderHistory.find({items: { $exists: true}}, (err, docs) => {
      if(err){
        console.log(err);
        rej();
      }
      res(docs);
    });
  });
};
window.db = db;
