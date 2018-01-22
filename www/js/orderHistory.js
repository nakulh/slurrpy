/*jshint esversion: 6 */
const moment = require('moment');
let orderHistoryManager = {};
var allOrders = [];
orderHistoryManager.do = {};

function dateFormat(date){
  return date.getDate() + '-' + Number(date.getMonth()+1) + '-' + date.getFullYear();
}

orderHistoryManager.do.processOrders = (orders) => {
  listOfOrders = [];
  for(let x = 0; x < orders.length; x++){
    order = orders[x];
    cost = 0;
    items = [];
    for(let y = 0; y < order.items.length; y++){
      cost += Number(order.items[y].price)*order.items[y].quantity;
      items.push({
        name: order.items[y].name,
        quantity: order.items[y].quantity,
        amount: order.items[y].price
      });
    }
    listOfOrders.push({
      'items count': order.items.length,
      'date': order.inTime.getDate() + '/' + Number(order.inTime.getMonth()+1) + '/' + order.inTime.getFullYear(),
      'time in': order.inTime.getHours() + ':' + order.inTime.getMinutes(),
      'time out': order.outTime.getHours() + ':' + order.outTime.getMinutes(),
      'serve time': Math.ceil((order.outTime.getTime() - order.inTime.getTime()) / (1000 * 60)),
      'amount': cost,
      'order': items
    });
  }
  return listOfOrders;
};

orderHistoryManager.do.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    db.do.getOrderHistory().then((orders) => {
      allOrders = orders;
      orders.sort((i1, i2) => {
          if(i1.inTime > i2.inTime) return -1;
          if(i1.inTime < i2.inTime) return 1;
          return 0;
      });
      listOfOrders = orderHistoryManager.do.processOrders(orders);
      resolve(listOfOrders);
    });
  });
};

orderHistoryManager.do.getBetweenDates = (from, to) => {
  console.log(from);
  console.log(to);
  from = from.split('-');
  to = to.split('-');
  from = from[2] + '-' + from[1] + '-' + from[0];
  to = to[2] + '-' + to[1] + '-' + Number(Number(to[0])+1);
  var ordersFrom = allOrders.length;
  var ordersTo = 0;
  var ordersToIsSet = false;
  var ordersFromIsSet = false;
  for(let x = 0; x < allOrders.length; x++){
    if(ordersToIsSet && ordersFromIsSet) break;
    if(!ordersFromIsSet && moment(allOrders[x].inTime).isBefore(from)){ ordersFrom = x; ordersFromIsSet = true;}
    if(!ordersToIsSet && moment(allOrders[x].inTime).isSameOrBefore(to)){ ordersTo = x; ordersToIsSet = true;}
  }
  console.log(ordersFrom);
  console.log(ordersTo);
  return orderHistoryManager.do.processOrders(allOrders.slice(ordersTo, ordersFrom));
};
