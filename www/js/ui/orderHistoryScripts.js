$(document).ready(function(){
	console.log("ready!");

	var orderHistory = {};
	var currentCustomerId = 0;

	getOrderHistory();

	$('.input-daterange').datepicker({
		format: "dd-mm-yyyy"
	});

	function getOrderHistory(){
		$.get("http://123.test", function(data){
			orderHistory = data;
			populateOrderHistoryTable(data);
		});

		//Only for Testing! To be removed during deployment.
		data = {
			1: {
				'items count': 2,
				'date': '13/01/2018',
				'time in': '12:15',
				'time out': '13:41',
				'serve time': '00:00',
				'amount': 550,
				'order': {
					1: {
						'name': 'Paneer Tikka',
						'quantity': 1,
						'amount': 450
					},
					2: {
						'name': 'Tandoori Roti',
						'quantity': 4,
						'amount': 100
					},
				}
			},
			2: {
				'items count': 1,
				'date': '12/01/2018',
				'time in': '11:25',
				'time out': '12:02',
				'serve time': '00:00',
				'amount': 350,
				'order': {
					3: {
						'name': 'Honey Chili Potato',
						'quantity': 1,
						'amount': 350
					},
				}
			}
		};
		orderHistory = data;
		populateOrderHistoryTable(data);
	}

	function populateOrderHistoryTable(orders){
		var i = 1;
		$("#order-history-table > tbody").empty();
		if(jQuery.isEmptyObject(orders)) {
		    var orderHistoryRow = '<tr>' +
			'<td colspan="8" style="text-align:center;">No records found</td>' +
			'</tr>';
			$("#order-history-table > tbody").append(orderHistoryRow);
		}
		else {
			$.each(orders, function(order_id, order_data){
				var orderHistoryRow = '<tr>' +
				'<th scope="row">' + i + '</th>' +
				'<td id="customer-items-count-' + order_id + '">' + order_data['items count'] + '</td>' +
				'<td id="customer-date-' + order_id + '">' + order_data['date'] + '</td>' +
				'<td id="customer-timein-' + order_id + '">' + order_data['time in'] + '</td>' +
				'<td id="customer-timeout-' + order_id + '">' + order_data['time out'] + '</td>' +
				'<td id="customer-serve-time-' + order_id + '">' + order_data['serve time'] + '</td>' +
				'<td id="customer-amount-' + order_id + '">' + order_data['amount'] + '</td>' +
				'<td><a id="customer-receipt-' + order_id + '" href="javascript:void(0);" class="remove-decoration"><i class="fas fa-external-link-alt" aria-hidden="true"></i></a></td>' +
				'</tr>';
				$("#order-history-table > tbody").append(orderHistoryRow);
				i++;
			});
		}
	}

	function openReceiptModal(){
		$("#receipt-modal").modal('show');
	}

	function closeReceiptModal(){
		$("#receipt-modal").modal('hide');
	}

	$('a[id^="customer-receipt-"]').click(function(){
		currentCustomerId = $(this).attr("id").slice(17);
		populateReceiptModal(orderHistory[currentCustomerId]);
		openReceiptModal();
	});

	function populateReceiptModal(customerData){
		var i = 1;
		$('#receipt-date').text(customerData['date']);
		$('#receipt-customer-name').text(customerData['name']);
		$("#receipt-table > tbody").empty();
		$.each(customerData['order'], function(order_id, order_data){
			var orderRow = '<tr>' +
			'<th scope="row">' + i + '</th>' +
			'<td id="receipt-item-name-' + order_id + '">' + order_data['name'] + '</td>' +
			'<td id="receipt-item-quantity-' + order_id + '">' + order_data['quantity'] + '</td>' +
			'<td id="receipt-item-amount-' + order_id + '">' + order_data['amount'] + '</td>' +
			'</tr>';
			$("#receipt-table > tbody").append(orderRow);
			i++;
		});
	}

	function openOrderHistoryFilterModal(){
		$('#order-history-filter-modal').modal('show');
	}

	function closeOrderHistoryFilterModal(){
		$('#order-history-filter-modal').modal('hide');
	}

	function addFilterChip(tag){
		var filterId = tag.split(' ').join('-');
		var chip = '<div id="filter-chip-' + filterId + '" class="chip">' +
		tag +
		'<span id="btn-close-chip-' + filterId + '">&times;</span>' +
		'</div>';
		$('#filter-chips-container').append(chip);
	}

	function removeFilterChip(filterId){
		$('#filter-chip-' + filterId).remove();
	}

	$(document).on('click', 'span[id^="btn-close-chip-"]', function(data){
		var filterId = $(this).attr("id").slice(15);
		removeFilterChip(filterId);
	});

	$('#order-history-search-filter').click(function(){
		openOrderHistoryFilterModal();
	});

	function searchFilterValid(){
		if($('#search-filter-start-date').val() == ""){
			$('#search-filter-start-date').focus();
			$('#order-history-filter-form-error').text("Start Date cannot be empty").css("margin-bottom", "5px");
			return false;
		}
		if($('#search-filter-end-date').val() == ""){
			$('#search-filter-end-date').focus();
			$('#order-history-filter-form-error').text("End Date cannot be empty").css("margin-bottom", "5px");
			return false;
		}
		$("#order-history-filter-form-error").text("").css("margin-bottom", "");
		return true;
	}

	$('#btn-apply-filter').click(function(){
		if(searchFilterValid()){
			addFilterChip($('#search-filter-start-date').val());
			addFilterChip($('#search-filter-end-date').val());
			closeOrderHistoryFilterModal();
		}
	});
});