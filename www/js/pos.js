/*jshint esversion: 6 */
const $ = require('jquery');
var {ipcRenderer} = require('electron');
ipcRenderer.on('cook', (e, p)=>{
  console.log(p);
});
var pos = {};
pos.do = {};
var posState = {
  selectedWalkin: false,
  walkinsCounter: 0,
  walkins: {},
  categoryMenu: [],
  selectedItem: false,
  currentOrder: []
};

const getCategoryButton = (c, category) => {
  return $(`<button id="cat-${c}" onclick="openCategory('${category}')" type="button" class="btn btn-outline-dark btn-menu">${category}</button>`);
};

const getItemButton = (i, item) => {
  return $(`<button id="item-${i}" onclick="selectItem(${i})" type="button" class="btn btn-outline-dark btn-menu">${item}</button>`);
};

const getOrderListItem = (item, i) => {
  status = `New`;
  if (item.status == 'inKitchen'){
    status = `<i class="fas fa-utensils" aria-hidden="true">`;
  }
  else if(item.status == 'served'){
    status = `<i class="fas fa-shopping-basket" aria-hidden="true">`;
  }
  return $(`<tr>
    <th scope="row"><input id="order-item-checkbox-${i}" type="checkbox"></th>
    <th scope="row">${status}</i></th>
    <td>${item.name}</td>
    <td id="order-item-quantity-1" class="text-center">${item.quantity}</td>
    <td id="order-item-amount-1" class="text-center">${item.price}</td>
  </tr>`);
};

const getWalkinElement = (walkinNumber, order) => {
  console.log(order);
  orderHTML = "";
  for(let x = 0; x < order.length; x++){
    orderHTML += `<p>${order[x].quantity}x ${order[x].name}</p>`;
  }
  posState.walkinsCounter++;
  return $(`<div id="order-info-${walkinNumber}">
    <div class="order-header">
      <p>#<span id="order-info-id-${walkinNumber}">${posState.walkinsCounter}</span><span id="order-info-edit-${walkinNumber}" onclick="editOrder('${walkinNumber}')"><i class="fas fa-edit" aria-hidden="true"></i></span></p>
      <p id="order-info-timer-${walkinNumber}">00:00</p>
    </div>
    <div id="order-body-${walkinNumber}">
      ${orderHTML}
    </div>
  </div>`);
};

db.do.getWalkinsStatus().then((walkins) => {
  $('#orders-container').empty();
  for(let x = 0; x < walkins.length; x++){
      walkin = walkins[x];
      if(walkin._id){
        $('#orders-container').append(getWalkinElement(walkin._id, walkin.order));
        posState.walkins[walkin._id] = walkin;
      }
  }
});

db.do.getCategories().then((categories) => {
  console.log(categories);
  for(let c in categories){
    $('#category-container').append(getCategoryButton(c, categories[c]));
  }
});

pos.do.walkinCustomer = (customer) => {
  posState.walkinsCounter++;
  posState.walkins[posState.walkinsCounter] = customer;
  posState.walkins[posState.walkinsCounter].order = [];
  db.do.walkinCustomer(customer, posState.walkinsCounter).then((msg)=>{
    console.log(msg);
  });
};

pos.do.getMenuFromCategory = (category) => {
  return new Promise((res, rej) => {
    db.do.getMenuFromCategory(category).then((menu) => {
      processedMenu = [];
      posState.categoryMenu = [];
      for(let i in menu){
        posState.categoryMenu.push(menu[i]);
        processedMenu.push(getItemButton(i, menu[i].name));
      }
      res(processedMenu);
    });
  });
};

pos.do.addItemToWalkin = (item, quantity) => {
  item.quantity = quantity;
  item.status = "new";
  item.custom = "not hot";
  posState.walkins[posState.selectedWalkin].order.push(item);
  db.do.addOrderToWalkin(item, posState.selectedWalkin).then((msg)=>{
  });
};

pos.do.resetOrderList = () => {
  orderList = posState.walkins[posState.selectedWalkin].order;
  db.do.resetOrderList(orderList, posState.selectedWalkin).then((res) => {
    console.log(res);
  });
};

pos.do.sendItemsToKitchen = (items) => {
  pos.do.resetOrderList();
  console.log("sending items!!!");
  console.log(items);
};

pos.do.archiveOrder = () => {
  let id = posState.selectedWalkin;
  let record = {};
  order = posState.walkins[posState.selectedWalkin].order;
  processedOrder = [];
  for(let x = 0; x < order.length; x++){
    let o = {
      name: order[x].name,
      price: order[x].price,
      quantity: order[x].quantity
    };
    processedOrder.push(o);
  }
  record.items = order;
  record.inTime = posState.walkins[posState.selectedWalkin].inTime;
  record.outTime = new Date();
  db.do.archiveOrder(record);
  db.do.walkOutCustomer(id);
};

pos.do.walkinCustomer = () => {
  db.do.walkinCustomer().then((id) => {
    posState.selectedWalkin = id;
    posState.walkins[id] = {order: []};
    $('#orders-container').append(getWalkinElement(id, []));
  });
};
/*db.do.getCategories().then((categories) => {
  console.log(categories);
});*/

/*db.do.getMenuFromCategory('Dessert').then((menu) => {
  console.log(menu);
});*/

/*db.do.addMenuItem({"category":"Drinks","price":200,"name":"Coffee","inStock":true}).then((msg)=>{
  console.log(msg);
}).catch((msg) => {
  console.log(msg);
});*/

/*db.do.updateMenuItem({"category":"Drinks","price":200,"name":"Coffee","inStock":false}).then((msg) => {
  console.log(msg);
});

db.do.getAllMenuItems().then((items) => {
  console.log(items);
});

db.do.seatCustomer({firstName: 'Nakul', lastName: 'Havelia', email: 'nakul@gmail.com', count: 1}, 1).then((msg)=>{
  console.log(msg);
});*/

/*db.do.addOrder({"category":"Drinks","price":200,"name":"Coffee","inStock":false}, 2, "not hot", 1).then((msg)=>{
  console.log(msg);
});*/
/*db.do.unseatCustomer(1, "great").then((msg)=>{
  console.log(msg);
});*/
