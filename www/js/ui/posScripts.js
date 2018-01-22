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
}
