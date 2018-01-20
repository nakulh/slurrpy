/*jshint esversion: 6 */
$(document).ready(function(){
	console.log("ready!");

	$("#content-container").click(function(){
		closeWalkin();
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

	$("div[id^='visitor-book-item-']").click(function(){
		openMenu();
	});

	$("div[id^='room-table-']").click(function(){
		posState.selectedTable = $(this).attr("id").slice(11);
		if(!posState.isOccupied[posState.selectedTable - 1]) {
			posState.customerType = 'table';
			$('#seat-customer-modal').modal('show');
		}
		else {
			openMenu('table', posState.selectedTable);
		}
	});

	function customerFieldsValid(){
		if($("#input-fn").val() == ""){
			$("#seat-customer-form-error").text("First Name cannot be empty").css("margin-bottom", "5px");
			$("#input-fn").focus();
			return false;
		}
		if($("#input-ln").val() == ""){
			$("#seat-customer-form-error").text("Last Name cannot be empty").css("margin-bottom", "5px");
			$("#input-ln").focus();
			return false;
		}
		if($("#input-email").val() == ""){
			$("#seat-customer-form-error").text("Email cannot be empty").css("margin-bottom", "5px");
			$("#input-email").focus();
			return false;
		}
		if($("#input-guest-count option:selected").text() == "Select number of guests"){
			$("#seat-customer-form-error").text("Invalid number of guests").css("margin-bottom", "5px");
			$("#input-guest-count").focus();
			return false;
		}
		$("#seat-customer-form-error").text("").css("margin-bottom", "");
		return true;
	}

	$("#btn-seat-customer").click(function(){
		if(customerFieldsValid()){
			if(posState.customerType == 'table'){
				pos.do.seatCustomer({
					firstName: $("#input-fn").val(),
					lastName: $("#input-ln").val(),
					email: $("#input-email").val(),
					count: $("#input-guest-count").val()
				});
				$('#room-table-' + posState.selectedTable).addClass('room-table-occupied');
				$('#visitor-book-body').append(getVisitorElement(posState.selectedTable, $("#input-fn").val()+' '+$("#input-ln").val(), $("#input-guest-count").val(), 0));
			}
			else{
				pos.do.walkinCustomer({
					firstName: $("#input-fn").val(),
					lastName: $("#input-ln").val(),
					email: $("#input-email").val(),
					count: $("#input-guest-count").val()
				});
				$('#overlay-walkin-body').append(getWalkinElement(posState.walkinsCounter, $("#input-fn").val()+' '+$("#input-ln").val(), $("#input-guest-count").val()));
			}
			console.log("Valid");
			$('#seat-customer-modal').modal('hide');
		}
	});

	$('#seat-customer-modal').on('hidden.bs.modal', function (e) {
  		$("#input-fn").val("");
  		$("#input-ln").val("");
  		$("#input-email").val("");
  		$("#input-guest-count").val("Select number of guests");
  		$("#seat-customer-form-error").text("").css("margin-bottom", "");
	});

	function openMenu(type, number) {
		posState.selectedTable = number;
		if(type == 'table'){
			resetOrderList();
			$('#overlay-menu-table').html("Table: " + number);
			$('#overlay-menu-guest-count').html("Guests: " + posState.tables[number - 1].count);
		}
		else{
			$('#overlay-menu-guest-count').html("Guests: " + posState.walkins[number - 1].count);
		}
		$("#overlay-menu").css("height", "100%");
	}

	$("#btn-close-menu").click(function(){
        closeMenu();
    });

	function closeMenu() {
		$("#overlay-menu").css("height", "0%");
	}

	$("#btn-walkin").click(function(){
        openWalkin();
    });

	function openWalkin() {
		console.log("open walkin");
		$("#overlay-walkin").css({"width": "300px", "border": "1px solid #f4f4f4"});
	}

	$("#btn-close-walkin").click(function(){
        closeWalkin();
    });

	function closeWalkin() {
		$("#overlay-walkin").css({"width": "0", "border": "none"});
	}

	$("#btn-new-walkin").click(function(){
		closeWalkin();
		posState.customerType = 'walkin';
		$('#seat-customer-modal').modal('show');
	});

	$("#btn-remove-item").click(() => {
		newOrderList = []
		console.log(posState.tables[posState.selectedTable-1].order);
		for(let o in posState.tables[posState.selectedTable-1].order){
			if(!$('#order-item-checkbox-'+o).prop('checked')){
				newOrderList.push(posState.tables[posState.selectedTable-1].order[o]);
			}
		}
		posState.tables[posState.selectedTable-1].order = newOrderList;
		resetOrderList();
		pos.do.resetOrderList();
	});
});
function openMenuWalkin(walkinNumber){
		closeWalkin();
		openMenu('walkin', walkinNumber);
}

function resetOrderList(){
	order = posState.tables[posState.selectedTable-1].order;
	$('#orderList').empty();
	for(let o in order){
		$('#orderList').append(getOrderListItem(order[o], 'new', o))
	}
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
function addItemToTable(){
	console.log($('#input-item-count').val());
	if(posState.selectedItem && posState.selectedTable > 0 && $('#input-item-count').val() != 'Quantity'){
		pos.do.addItemToTable(posState.selectedItem, $('#input-item-count').val(), posState.selectedTable);
		resetOrderList();
	}
	else
		console.log('no item selected');
}
