/*jshint esversion: 6 */
$(document).ready(function(){
	console.log("ready!");

	$("#content-container").click(function(){
		closeUserOptions();
	});

	$("#nav-item-user").click(function(){
		if($("#user-options-container").css("display") == "none")
			openUserOptions();
		else
			closeUserOptions();
	});

	function openUserOptions(){
		$("#user-options-container").css("display", "block");
	}

	function closeUserOptions(){
		$("#user-options-container").css("display", "none");
	}

	function openOrders() {
		$("#orders-modal").modal('show');
	}

	function closeOrders() {
		$("#orders-modal").modal('hide');
	}

	$("#btn-orders").click(function(){
		openOrders();
	});
});

function createNewOrder(){
	console.log("creating new order");
	resetOrderList([]);
	pos.do.walkinCustomer();
}

function openCategory(category){
	pos.do.getMenuFromCategory(category).then((menu) => {
		$('#categoryMenuList').empty();
		$('#categoryMenuList').append($(`<p class="section-header">${category}</p>)`));
		for(let i in menu){
			$('#categoryMenuList').append(menu[i]);
		}
	});
}

function selectItem(i){
	posState.selectedItem = posState.categoryMenu[i];
	console.log(posState.categoryMenu);
	$('#selectedItem').html(posState.selectedItem.name);
}

function addItemToOrder(){
	console.log($('#input-item-count').val());
	if(posState.selectedItem && posState.selectedWalkin && $('#input-item-count').val() != 'Quantity'){
		console.log("item selection is valid");
		pos.do.addItemToWalkin(posState.selectedItem, $('#input-item-count').val());
		resetOrderList(posState.walkins[posState.selectedWalkin].order);
		resetOrderOverview(posState.walkins[posState.selectedWalkin].order, posState.selectedWalkin);
	}
	else
		console.log('no item selected/invalid choice');
}

function editOrder(walkinId){
	console.log(walkinId);
	posState.selectedWalkin = walkinId;
	resetOrderList(posState.walkins[walkinId].order);
}

function resetOrderList(order){
	console.log(order);
	$('#orderList').empty();
	for(let x = 0; x < order.length; x++){
		$('#orderList').append(getOrderListItem(order[x], x));
	}
}

function resetOrderOverview(order, id){
	console.log(order);
	$(`#order-body-${id}`).empty();
	for(let x = 0; x < order.length; x++){
		$(`#order-body-${id}`).append(`<p>${order[x].quantity}x ${order[x].name}</p>`)
	}
}

function getCheckboxes(){
	currentOrder = posState.walkins[posState.selectedWalkin].order;
	toEdit = [];
	for(let x = currentOrder.length-1; x >= 0; x--){
		console.log($(`#order-item-checkbox-${x}`).is(":checked"));
		if($(`#order-item-checkbox-${x}`).is(":checked")){
			toEdit.push(x);
		}
	}
	return toEdit;
}

function removeItems(){
	currentOrder = posState.walkins[posState.selectedWalkin].order;
	console.log(currentOrder);
	toDelete = getCheckboxes();
	console.log(toDelete);
	for(let x = 0; x < toDelete.length; x++){
		currentOrder.splice(toDelete[x], 1);
	}
	console.log(currentOrder);
	posState.walkins[posState.selectedWalkin].order = currentOrder;
	resetOrderList(currentOrder);
	resetOrderOverview(currentOrder, posState.selectedWalkin);
	pos.do.resetOrderList();
}

function sendItemsToKitchen(){
	currentOrder = posState.walkins[posState.selectedWalkin].order;
	toSend = getCheckboxes();
	console.log(toSend);
	itemsToSend = [];
	for(let x = 0; x < toSend.length; x++){
		currentOrder[toSend[x]].status = 'inKitchen';
		itemsToSend.push(currentOrder[toSend[x]]);
	}
	posState.walkins[posState.selectedWalkin].order = currentOrder;
	pos.do.sendItemsToKitchen(itemsToSend);
	resetOrderList(currentOrder);
}

function markAsServed(){
	currentOrder = posState.walkins[posState.selectedWalkin].order;
	toMark = getCheckboxes();
	console.log(toMark);
	for(let x = 0; x < toMark.length; x++){
		currentOrder[toMark[x]].status = 'served';
	}
	posState.walkins[posState.selectedWalkin].order = currentOrder;
	pos.do.resetOrderList();
	resetOrderList(currentOrder);
}

function checkout(){
	console.log('commence checkout');
	order = posState.walkins[posState.selectedWalkin];
	pos.do.archiveOrder();
	$(`#order-info-${posState.selectedWalkin}`).remove();
	posState.selectedWalkin = false;
	resetOrderList([]);
}
