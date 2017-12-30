/*jshint esversion: 6 */
db.do.getCategories().then((categories) => {
  console.log(categories);
});

/*db.do.getMenuFromCategory('Dessert').then((menu) => {
  console.log(menu);
});*/

/*db.do.addMenuItem({"category":"Drinks","price":200,"name":"Coffee","inStock":true}).then((msg)=>{
  console.log(msg);
}).catch((msg) => {
  console.log(msg);
});*/

db.do.updateMenuItem({"category":"Drinks","price":200,"name":"Coffee","inStock":false}).then((msg) => {
  console.log(msg);
});

db.do.getAllMenuItems().then((items) => {
  console.log(items);
});

db.do.seatCustomer({firstName: 'Nakul', lastName: 'Havelia', email: 'nakul@gmail.com', count: 1}, 1).then((msg)=>{
  console.log(msg);
});

/*db.do.addOrder({"category":"Drinks","price":200,"name":"Coffee","inStock":false}, 2, "not hot", 1).then((msg)=>{
  console.log(msg);
});*/
/*db.do.unseatCustomer(1, "great").then((msg)=>{
  console.log(msg);
});*/
