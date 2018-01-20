/*jshint esversion: 6 */
$(document).ready(function(){
	console.log("ready!");

	var menu = {};
	var currentCategoryId = 0;
	var currentItemId = 0;

	getMenu();
	function getMenu(){
		menuManager.do.getFullMenu().then((data) => {
			menu = data;
			console.log(data);
			populateMenuTable(data);
		});
	}

	function populateMenuTable(data){
		$("#menu-table").empty();
		$.each(data, function(category_id, category_data){
			populateCategoryHead(category_id, category_data);
			populateItemHead();
			populateItemsBody(category_id, category_data['items']);
		});
	}

	function populateCategoryHead(category_id, category_data){
		var categoryHead = '<thead>' + '<tr>' +
		'<th scope="col" style="border:none;"><a id="category-edit-' + category_id + '" href="javascript:void(0)" class="remove-decoration"><i class="fas fa-edit" aria-hidden="true"></i></a></th>' +
		'<th scope="col" colspan="3" style="padding-top:20px; border:none;"><span id="category-name-' + category_id + '" style="font-size: 24px;">' + category_data['name'] + '</span></th>' +
		'<th scope="col" style="border:none;" class="text-center"><a id="item-add-btn-' + category_id + '" href="javascript:void(0)" class="btn btn-sm btn-flat-dark" role="button">+ Add</a></th>' +
		'<th scope="col" style="border:none;"></th>' +
		'<th scope="col" style="border:none;"><a id="category-delete-' + category_id + '" href="javascript:void(0)" class="remove-decoration"><i class="far fa-trash-alt" aria-hidden="true"></i></a></th>' +
		'</tr>' + '</thead>';
		$("#menu-table").append(categoryHead);
	}

	function populateItemHead(){
		var itemHead = '<thead>' + '<tr>' +
		'<th scope="col">#</th>' +
		'<th scope="col">Name</th>' +
		'<th scope="col" class="text-center">Short Name</th>' +
		'<th scope="col" class="text-center">Price</th>' +
		'<th scope="col" class="text-center">Serving</th>' +
		'<th scope="col"></th>' +
		'<th scope="col"></th>' +
		'</tr>' + '</thead>';
		$("#menu-table").append(itemHead);
	}

	function populateItemsBody(category_id, items){
		var itemHead = '<tbody>';
		var i=1;
		if(jQuery.isEmptyObject(items)) {
		    itemHead += '<tr>' +
			'<td colspan="6" style="text-align:center;">No Items in this Category</td>' +
			'</tr>';
		}
		else {
			$.each(items, function(item_id, item_data){
				itemHead += '<tr>' +
				'<th scope="row">' + i + '</th>' +
				'<td id="item-name-' + item_id + '">' + item_data['name'] + '</td>' +
				'<td id="item-short-name-' + item_id + '" class="text-center">' + item_data['short name'] + '</td>' +
				'<td id="item-price-' + item_id + '" class="text-center">' + item_data['price'] + '</td>' +
				'<td class="text-center"><input id="item-serve-' + category_id + '-' + item_id + '" type="checkbox" ' + item_data['serving'] + '></td>' +
				'<td><a id="item-edit-' + category_id + '-' + item_id + '" href="javascript:void(0)" class="remove-decoration"><i class="fas fa-edit" aria-hidden="true"></i></a></td>' +
				'<td><a id="item-delete-' + category_id + '-' + item_id + '" href="javascript:void(0)" class="remove-decoration"><i class="far fa-trash-alt" aria-hidden="true"></i></a></td>' +
				'</tr>';
				i++;
			});
		}
		itemHead += '</tbody>';
		$("#menu-table").append(itemHead);
	}

	function openAddCategoryModal(){
		$("#add-category-modal").modal('show');
	}

	function closeAddCategoryModal(){
		$("#add-category-modal").modal('hide');
	}

	function openUpdateCategoryModal(){
		$('#update-category-modal').modal('show');
	}

	function closeUpdateCategoryModal(){
		$("#update-category-modal").modal('hide');
	}

	function openDeleteCategoryModal(){
		$('#delete-category-modal').modal('show');
	}

	function closeDeleteCategoryModal(){
		$("#delete-category-modal").modal('hide');
	}

	function openAddItemModal(){
		$("#add-item-modal").modal('show');
	}

	function closeAddItemModal(){
		$("#add-item-modal").modal('hide');
	}

	function openUpdateItemModal(){
		$("#update-item-modal").modal('show');
	}

	function closeUpdateItemModal(){
		$("#update-item-modal").modal('hide');
	}

	function openDeleteItemModal(){
		$("#delete-item-modal").modal('show');
	}

	function closeDeleteItemModal(){
		$("#delete-item-modal").modal('hide');
	}

	$("#btn-category-add").click(function(){
        openAddCategoryModal();
    });

    $(document).on("click","a[id^='category-edit-']", function(){
			currentCategoryId = $(this).attr("id").slice(14);
			$("#input-cn-update").val(menu[currentCategoryId]['name']);
	        openUpdateCategoryModal();
    });

    $(document).on("click","a[id^='category-delete-']", function(){
			currentCategoryId = $(this).attr("id").slice(16);
			$("#delete-category-modal-message").text('Are you sure you want to delete the category "' + menu[currentCategoryId]['name'] + '"?');
	        openDeleteCategoryModal();
    });

    $(document).on("click","a[id^='item-add-btn-']", function(){
			currentCategoryId = $(this).attr("id").slice(13);
	        openAddItemModal();
    });

    $(document).on("click","a[id^='item-edit-']", function(){
			var temp = $(this).attr("id").slice(10).split("-");
			currentCategoryId = temp[0];
			currentItemId = temp[1];
			$("#input-in-update").val(menu[currentCategoryId]['items'][currentItemId]['name']);
			$("#input-ip-update").val(menu[currentCategoryId]['items'][currentItemId]['price']);
			$("#input-isn-update").val(menu[currentCategoryId]['items'][currentItemId]['short name']);
	        openUpdateItemModal();
    });

    $(document).on("click","a[id^='item-delete-']", function(){
	    var temp = $(this).attr("id").slice(12).split("-");
			currentCategoryId = temp[0];
			currentItemId = temp[1];
			$("#delete-item-modal-message").text('Are you sure you want to delete the item "' + menu[currentCategoryId]['items'][currentItemId]['name'] + '"?');
	    openDeleteItemModal();
    });

    $(document).on("change","input[id^='item-serve-']", function(){
    	currentItemId = $(this).attr("id").split("-")[3];
    	toggleItemServing(currentItemId, $(this).is(':checked'));
    });

    function addCategoryFieldsValid() {
    	if($("#input-cn-add").val() == ""){
			$("#add-category-form-error").text("Category name cannot be empty").css("margin-bottom", "5px");
			$("#input-cn-add").focus();
			return false;
		}
		$("#add-category-form-error").text("").css("margin-bottom", "");
		return true;
    }

    function updateCategoryFieldsValid() {
    	if($("#input-cn-update").val() == ""){
			$("#update-category-form-error").text("Category name cannot be empty").css("margin-bottom", "5px");
			$("#input-cn-update").focus();
			return false;
		}
		$("#update-category-form-error").text("").css("margin-bottom", "");
		return true;
    }

    function addItemFieldsValid() {
    	if($("#input-in-add").val() == ""){
			$("#add-item-form-error").text("Item name cannot be empty").css("margin-bottom", "5px");
			$("#input-in-add").focus();
			return false;
		}
		if($("#input-ip-add").val() == ""){
			$("#add-item-form-error").text("Item price cannot be empty").css("margin-bottom", "5px");
			$("#input-ip-add").focus();
			return false;
		}
		$("#add-item-form-error").text("").css("margin-bottom", "");
		return true;
    }

    function updateItemFieldsValid() {
    	if($("#input-in-update").val() == ""){
			$("#update-item-form-error").text("Item name cannot be empty").css("margin-bottom", "5px");
			$("#input-in-update").focus();
			return false;
		}
		if($("#input-ip-update").val() == ""){
			$("#update-item-form-error").text("Item price cannot be empty").css("margin-bottom", "5px");
			$("#input-ip-update").focus();
			return false;
		}
		$("#update-item-form-error").text("").css("margin-bottom", "");
		return true;
    }

    function addCategory(categoryName) {
    	params = {
    		'categoryName': categoryName
    	};
			menuManager.do.addCategory(categoryName)
    	menu[categoryName] = {
			'name': categoryName,
			'items': {}
		};
		populateMenuTable(menu);
		closeAddCategoryModal();
    }

    /*function updateCategory(categoryId, categoryName) {
    	params = {
    		'categoryId': categoryId,
    		'categoryName': categoryName
    	};
    	$.post("http://123.test", params, function(data){
    		if(data['status'] == 1){
    			menu[categoryId]['name'] = params['categoryName'];
    			populateMenuTable(menu);
    			closeUpdateCategoryModal();
    		}
    	});
    	//Only for Testing! To be removed during deployment.
    	menu[categoryId]['name'] = params['categoryName'];
		populateMenuTable(menu);
		closeUpdateCategoryModal();
	}*/

    function deleteCategory(categoryId) {
    	menuManager.do.deleteCategory(categoryId);
    	delete menu[categoryId];
			populateMenuTable(menu);
			closeDeleteCategoryModal();
    }

    function addItem(categoryId, itemName, itemPrice, itemShortName) {
    	params = {
    		'categoryId': categoryId,
    		'itemName': itemName,
    		'itemPrice': itemPrice,
    		'itemShortName': itemShortName
    	};
    	menuManager.do.addItem({
				category: categoryId,
				name: itemName,
				price: itemPrice,
				inStock: true,
				shortName: itemShortName
			}).then((id) => {
				menu[categoryId]['items'][id] = {
				'name': params['itemName'],
				'price': params['itemPrice'],
				'serving': 'checked',
				'short name': params['itemShortName']
				};
				populateMenuTable(menu);
				closeAddItemModal();
			});
    }

    function updateItem(categoryId, itemId, itemName, itemPrice, itemShortName) {
    	params = {
    		'itemId': itemId,
    		'itemName': itemName,
    		'itemPrice': itemPrice,
    		'itemShortName': itemShortName
    	};
			menuManager.do.editItem({
				name: itemName,
				price: itemPrice,
				shortName: itemShortName
			}, itemId).then(()=>{

			});
			menu[categoryId]['items'][itemId]['name'] = itemName;
			menu[categoryId]['items'][itemId]['price'] = itemPrice;
			menu[categoryId]['items'][itemId]['short name'] = itemShortName;
			populateMenuTable(menu);
			closeUpdateItemModal();
    }

    function deleteItem(categoryId, itemId) {
    	params = {
    		'itemId': itemId
    	};
    	menuManager.do.deleteItem(itemId);
    	delete menu[categoryId]['items'][itemId];
    	populateMenuTable(menu);
    	closeDeleteItemModal();
    }

    function toggleItemServing(itemId, serving){
			console.log(serving);
    	menuManager.do.toggleItemServing(itemId, serving);
    }

    $("#btn-add-category").click(function(){
    	if(addCategoryFieldsValid()){
			console.log("Valid");
			addCategory($("#input-cn-add").val());
		}
    });

    $("#btn-update-category").click(function(){
    	if(updateCategoryFieldsValid()){
			console.log("Valid");
			updateCategory(currentCategoryId, $("#input-cn-update").val());
		}
    });

    $("#btn-delete-category").click(function(){
    	deleteCategory(currentCategoryId);
    });

    $("#btn-add-item").click(function(){
    	if(addItemFieldsValid()){
			console.log("Valid");
			addItem(currentCategoryId, $("#input-in-add").val(), $("#input-ip-add").val(), $("#input-isn-add").val());
		}
    });

    $("#btn-update-item").click(function(){
    	if(updateItemFieldsValid()){
			console.log("Valid");
			updateItem(currentCategoryId, currentItemId, $("#input-in-update").val(), $("#input-ip-update").val(), $("#input-isn-update").val());
		}
    });

    $("#btn-delete-item").click(function(){
    	deleteItem(currentCategoryId, currentItemId);
    });

    $('#add-category-modal').on('hidden.bs.modal', function (e) {
        $("#input-cn-add").val("");
        $("#add-category-form-error").text("").css("margin-bottom", "");
    });

    $('#update-category-modal').on('hidden.bs.modal', function (e) {
        $("#input-cn-update").val("");
        $("#update-category-form-error").text("").css("margin-bottom", "");
    });

    $('#add-item-modal').on('hidden.bs.modal', function (e) {
        $("#input-in-add").val("");
        $("#input-isn-add").val("");
        $("#input-ip-add").val("");
        $("#add-item-form-error").text("").css("margin-bottom", "");
    });

    $('#update-item-modal').on('hidden.bs.modal', function (e) {
        $("#input-in-update").val("");
        $("#input-isn-update").val("");
        $("#input-ip-update").val("");
        $("#update-item-form-error").text("").css("margin-bottom", "");
    });
});
