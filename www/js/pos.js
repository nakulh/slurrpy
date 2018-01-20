/*jshint esversion: 6 */
//const $ = require('jquery');
var {ipcRenderer} = require('electron');
ipcRenderer.on('cook', (e, p)=>{
  console.log(p);
});
var pos = {};
pos.do = {};
var posState = {
  isOccupied: [false, false, false, false, false, false, false],
  selectedTable: 0,
  tables: [{}, {}, {}, {}, {}, {}, {}],
  walkinsCounter: 0,
  walkins: {},
  categoryMenu: [],
  selectedItem: false,
  customerType: 'table'
};

const getCategoryButton = (c, category)=>{
  return $(`<button id="cat-${c}" onclick="openCategory('${category}')" type="button" class="btn btn-outline-dark btn-menu">${category}</button>`);
};

const getItemButton = (i, item) => {
  return $(`<button id="item-${i}" onclick="selectItem(${i})" type="button" class="btn btn-outline-dark btn-menu">${item}</button>`);
};

const getOrderListItem = (item, status, i) => {
  if(status == 'new'){
    status = `<input id="order-item-checkbox-${i}" type="checkbox">`;
  }
  else if (status == 'inKitchen'){
    status = `<i class="fas fa-utensils" aria-hidden="true">`;
  }
  else if(status == 'served'){
    status = `<i class="fas fa-shopping-basket" aria-hidden="true">`;
  }
  return $(`<tr>
    <th scope="row">${status}</i></th>
    <td>${item.name}</td>
    <td id="order-item-quantity-1" class="text-center">${item.quantity}</td>
    <td id="order-item-amount-1" class="text-center">${item.price}</td>
  </tr>`);
};

const getVisitorElement = (tableNumber, visitorName, headCount, orderCount) => {
  return $(`<div id="visitor-book-item-${tableNumber}">
    <p id="seated-guest-table-1" class="rounded-circle">${tableNumber}</p>
    <div>
      <div class="visitor-book-item-info-container">
        <p id="seated-guest-name-${tableNumber}">${visitorName}</p>
        <p id="seated-guest-time-${tableNumber}" class="ml-auto">00:00</p>
      </div>
      <div class="visitor-book-item-status-container">
        <span id="seated-guest-count-${tableNumber}" class="border rounded"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;${headCount}</span>
        <span id="seated-guest-items-pos-${tableNumber}" class="border rounded"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;${orderCount}</span>
      </div>
    </div>
  </div>`);
};

const getWalkinElement = (walkinNumber, visitorName, headCount) => {
  return $(`<div id="walkin-book-item-${walkinNumber}" class="walkin-book-item" onclick="openMenuWalkin(${walkinNumber})">
    <span id="walkin-guest-items-pos-1" class="border rounded"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;${headCount}</span>
    <p id="walkin-guest-name-1">${visitorName}</p>
    <p id="walkin-guest-time-1" class="ml-auto">00:00</p>
  </div>`);
};

db.do.getTablesStatus().then((tables) => {
  for(var x = 0; x < tables.length; x++){
    table = tables[x];
    if(table.firstName){
        $('#room-table-' + table.number).addClass("room-table-occupied");
        $('#visitor-book-body').append(getVisitorElement(table.number, table.firstName+" "+table.lastName, table.count, table.order.length));
        posState.isOccupied[table.number - 1] = true;
        posState.tables[table.number - 1] = table;
    }
  }
});

db.do.getWalkinsStatus().then((walkins) => {
  for(let x = 0; x < walkins.length; x++){
      walkin = walkins[x];
      if(walkin.firstName){
        $('#overlay-walkin-body').append(getWalkinElement(walkin.number, walkin.firstName+" "+walkin.lastName, walkin.count));
        posState.walkinsCounter = posState.walkinsCounter < walkin.number ? walkin.number : posState.walkinsCounter;
        posState.walkins[walkin.number] = walkin;
      }
  }
});

db.do.getCategories().then((categories) => {
  console.log(categories);
  for(let c in categories){
    $('#category-container').append(getCategoryButton(c, categories[c]));
  }
});

pos.do.seatCustomer = (customer) => {
  posState.tables[posState.selectedTable - 1] = customer;
  posState.tables[posState.selectedTable - 1].order = [];
  posState.isOccupied[posState.selectedTable - 1]  = true;
  db.do.seatCustomer(customer, posState.selectedTable).then((msg)=>{
    console.log(msg);
  });
};

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

pos.do.addItemToTable = (item, quantity, tableNumber) => {
  posState.tables[tableNumber - 1].order.push(item);
  db.do.addOrder(item, quantity, "not hot", tableNumber).then((msg)=>{
    console.log(msg);
  });
};

pos.do.resetOrderList = () => {
  db.do.resetOrderList(posState.tables[posState.selectedTable -1].order, posState.selectedTable).then((res) => {
    console.log(res);
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
