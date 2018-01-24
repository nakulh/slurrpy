/*jshint esversion: 6 */
var socket = io();
orderData = {};
n = 0;
socket.on('addItems', function(items){
    console.log(items);
    for(let x = 0; x < items.length; x++){
      item = items[x];
      if(!orderData[item.belongsTo]){
        orderData[item.belongsTo] = {};
        orderData[item.belongsTo].number = ++n;
        orderData[item.belongsTo].type = item.type;
        orderData[item.belongsTo].items = [];
        addOrderContainer(item.belongsTo, n, item.type);
      }
      orderData[item.belongsTo].items.push(item);
      addOrderToTable(item.belongsTo, orderData[item.belongsTo].items.length-1, item.name, item.quantity, item.status);
    }
    //populateOrders(orderData);
});
$(document).ready(function(){
	console.log("ready!");

	//!!! TEST BLOCK START !!!
/*
	orderData = {
		1: {
			'number': 1,
			'type': 'Dine In',
			'items' : {
				1: {
					'name': 'cec',
					'quantity': 2,
					'status': 'inKitchen'
				},
				2: {
					'name': 'vsrv',
					'quantity': 9,
					'status': 'inKitchen'
				},
				3: {
					'name': 'fbgbr',
					'quantity': 5,
					'status': 'serve'
				}
			}
		},
		2: {
			'number': 2,
			'type': 'Take Away',
			'items' : {
				4: {
					'name': 'regerfvg',
					'quantity': 1,
					'status': 'inKitchen'
				}
			}
		},
		3: {
			'number': 3,
			'type': 'Take Away',
			'items' : {
				5: {
					'name': 'afe',
					'quantity': 4,
					'status': 'serve'
				},
				6: {
					'name': 'gbrtbtr',
					'quantity': 2,
					'status': 'inKitchen'
				},
				7: {
					'name': 'trsbrb ebei',
					'quantity': 5,
					'status': 'inKitchen'
				},
			}
		}
	};

	populateOrders(orderData);

	addOrderContainer(4, 4, 'Dine In');

	addOrderToTable(4, 8, 'eftgvre', 3, 'inKitchen');
	addOrderToTable(4, 9, 'vsesaef', 6, 'inKitchen');
	addOrderToTable(4, 10, 'sgsgf', 1, 'serve');
	addOrderToTable(4, 11, 'fsgsg', 9, 'serve');

	removeOrderContainer(2);

	removeOrderFromTable(3, 5);
*/
	//!!! TEST BLOCK END !!!

	function populateOrders(orders){
		$.each(orders, function(order_id, order_data){
			addOrderContainer(order_id, order_data['number'], order_data['type']);
			$.each(order_data['items'], function(item_id, item_data){
				addOrderToTable(order_id, item_id, item_data['name'], item_data['quantity'], item_data['status']);
			});
		});
	}
});

function serveItems(){
  $('.orderCheckbox:checkbox:checked').each((i, e) => {
    console.log(e.id);
    belongsTo = e.id.split('-')[2];
    itemIndex = e.id.split('-')[3];
    item = orderData[belongsTo].items[itemIndex];
    socket.emit('itemCooked', item);
  });
}

	function addOrderContainer(order_id, order_number, order_type){
		var orderContainer = '<div id="order-container-' + order_id + '" class="col-12 col-sm-6 col-md-4 col-lg-3"></div>';
		$("#order-list-container").append(orderContainer);

		var orderInfo = '<div class="order-info-container">' +
		'<p class="order-number">#' + order_number + ' - ' + order_type + '</p>' +
		'<p id="order-timer-' + order_id + '">00:00</p>' +
		'</div>';
		$("#order-container-" + order_id).append(orderInfo);

		var orderTable = '<table id="order-table-' + order_id + '" class="table table-sm table-hover">' +
		'<thead><tr>' +
		'<th>#</th>' +
		'<th>Item</th>' +
		'<th style="text-align:center;">Qty.</th>' +
		'</tr></thead>' +
		'<tbody></tbody' +
		'</table>';
		$("#order-container-" + order_id).append(orderTable);
	}

	function addOrderToTable(order_id, item_id, item_name, item_quantity, item_status){
		var itemRow = '';
		if(item_status === 'inKitchen'){
			itemRow = '<tr id="order-row-' + order_id + '-' + item_id + '">' +
			'<th id="item-status-' + item_id + '" scope="row"><input id="order-checkbox-' + order_id + '-' + item_id + '" class="orderCheckbox" type="checkbox" name="order-item" value="order-item-' + order_id + '"></th>' +
			'<td id="item-name-' + item_id + '">' + item_name + '</td>' +
			'<td id="item-quantity-' + item_id + '" style="text-align:center;">' + item_quantity + '</td>' +
			'</tr>';
        }
        else if(item_status === 'serve'){
        	itemRow = '<tr id="order-row-' + order_id + '-' + item_id + '">' +
			'<th id="item-status-' + item_id + '" scope="row"><i class="fa fa-shopping-basket" aria-hidden="true"></i></th>' +
			'<td id="item-name-' + item_id + '">' + item_name + '</td>' +
			'<td id="item-quantity-' + item_id + '" style="text-align:center;">' + item_quantity + '</td>' +
			'</tr>';
        }
		$('#order-table-' + order_id).append(itemRow);
	}

function removeOrderContainer(order_id){
  delete orderData[order_id];
  $('#order-container-' + order_id).remove();
}

function removeOrderFromTable(order_id, item_id){
  delete orderData[order_id]['items'][item_id];
  $('#order-row-' + order_id + '-' + item_id).remove();
}
