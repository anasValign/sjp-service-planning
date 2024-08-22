//service code
var productCounter = 1;
var areaCounter = 1;
var limitNumber = 200;
var offsetNumber = 0;
var Existing_Cus = [];
var my2dArr = [];
var otherCus = "";
SJP.MultiCustomers = function (areas, CusFromSubform) {
	if (offsetNumber == 0) {
		otherCus = "";
	}
	console.log("new function");
	console.log(areaCounter);
	console.log("areas");
	console.log(areas);
	var userHqId = $("#userHqId").val();
	console.log(userHqId);
	console.log("areas");
	console.log("customers");
	var moreRecords;
	//console.log("select Customer_Name from Sales_Hierarchy where ((Area_SL in (" + areas + ") and BCL = 'Yes') and HQ='" + userHqId + "')");
	var config = {
		// "select_query": "select Customer_Code from Sales_Hierarchy where (Area_SL in (" + areas + ") LIMIT "+ limitNumber +" OFFSET "+ offsetNumber +""
		select_query:
			"select Customer_Name from Sales_Hierarchy where (Area_SL in (" +
			areas +
			")) LIMIT " +
			limitNumber +
			" OFFSET " +
			offsetNumber +
			"",
		//"select_query": "select Customer_Name from Sales_Hierarchy where ((Area_SL in (" + areas + ") and BCL = 'Yes') and HQ='" + userHqId + "')"
		//  "select_query": "select Customer_Name from Sales_Hierarchy where Area_SL in ('Rajakkad') and BCL = 'Yes' and HQ = '84320000000147376' "
		//and HQ = '84320000000147376'
		// and HQ = " + userHqId + "
	};
	//The Editing for new control flow ended here everything else remains the same
	console.log("ABCD" + config);
	ZOHO.CRM.API.coql(config).then(function (data) {
		var customers = data.data;
		var myCusIdArr = [];
		var myCusnameArr = [];
		moreRecords = data.info.more_records;
		var sortedCustomerArr;

		var lengthOfCus = customers.length;
		var countravr = 0;
		$.each(customers, function (key, val) {
			console.log(customers);
			console.log(customers.length);
			if (val.Customer_Name.id != null) {
				var CustRecordID = val.Customer_Name.id;
			}
			console.log("Customer RecordID Start");
			console.log(CustRecordID);
			console.log("Customer RecordID End");
			// ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: CustRecordID }).then(function(data) {
			ZOHO.CRM.API.getRecord({
				Entity: "Accounts",
				RecordID: CustRecordID,
			}).then(function (data) {
				console.log(data);
				var CustomersData = data.data;
				$.each(CustomersData, function (key2, val2) {
					console.log(val2.Account_Name);
					console.log(val2.id);
					// myCusIdArr.push(val2.id);
					// myCusnameArr.push(val2.Account_Name);
					myStr = {
						Account_Name: val2.Account_Name,
						id: val2.id,
					};
					my2dArr.push(myStr);

					// $('#AddCustomers').append('<option value='+val2.id+'>'+ val2.Account_Name +'</option>');
					// $('#AddCustomers').append('<option value='84320000000433379'>'S.N TRUST HOSPITAL'</option>');
				}); //inner foreach loop
				console.log(my2dArr.length);
				console.log(customers.length);
				console.log(my2dArr);

				console.log(customers);
				countravr++;
				console.log(countravr);
				console.log(lengthOfCus);
				// if(customers.length ==my2dArr.length)
				if (countravr == lengthOfCus) {
					console.log(customers.length);
					console.log(my2dArr.length);

					my2dArr = my2dArr.filter((item, i, ar) => ar.indexOf(item) === i);
					console.log(my2dArr);
					//SJP.customers_exp = my2dArr;
					sortedCustomerArr = my2dArr.sort(function (a, b) {
						return a.Account_Name.localeCompare(b.Account_Name);
					});
					console.log(my2dArr);

					// var testCusArr =[{Account_Name: "A V Hospital", id: "84320000002244149"},
					// {Account_Name: "Basavanagudi Medical Centre", id: "84320000002244175"},
					// {Account_Name: "B S Narayan Memorial Hospital", id: "84320000002244172"}];
					var testCusArr = CusFromSubform;
					console.log(testCusArr.length);
					var CusidArray = [];
					for (var i = 0; i < testCusArr.length; i++) {
						CusidArray.push(testCusArr[i].id);
					}
					console.log(CusidArray);
					sortedCustomerArr = sortedCustomerArr.filter(
						(item, i, ar) => ar.indexOf(item) === i
					);
					console.log(sortedCustomerArr);
					//to remove duplicates  though they are from differnt HQ
					var result = sortedCustomerArr.reduce((unique, o) => {
						if (
							!unique.some(
								(obj) => obj.Account_Name === o.Account_Name && obj.id === o.id
							)
						) {
							unique.push(o);
						}
						return unique;
					}, []);
					console.log(result);
					//
					//$.each(sortedCustomerArr, function(key, val) {
					$.each(result, function (key, val) {
						if (CusidArray.includes(val.id)) {
							otherCus +=
								"<option selected value=" +
								val.id +
								">" +
								val.Account_Name +
								"</option>";
						} else {
							if (SJP.Planned_Cus.includes(val.id)) {
								otherCus +=
									'<option style="background-color:#90EE90;font-weight:bold;" value=' +
									val.id +
									">" +
									val.Account_Name +
									"</option>";
							} else {
								otherCus +=
									"<option value=" +
									val.id +
									">" +
									val.Account_Name +
									"</option>";
							}
						}

						console.log(
							"<option value=" + val.id + ">" + val.Account_Name + "</option>"
						);
					});
					//$('#customer_Selector').empty();
					$("#customer_Selector").empty();
					$("#customer_Selector").append(otherCus);
					$("#customer_Selector").selectpicker("refresh");
				}
			}); //getRecord closing
		}); //foreach closing
		if (moreRecords == true) {
			offsetNumber = offsetNumber + 200;
			console.log(offsetNumber);
			SJP.MultiCustomers(areas, CusFromSubform);
		}
		if (moreRecords == false) {
			// console.log("making offset as zero")
			offsetNumber = 0;
			// console.log(offsetNumber);
		}
	});
}; //Selected Customers Closing

//-----------------------------------------------Creating Rows After Selecting Multiple Customers START---------------------------------

SJP.SelectedCustomers = function (stringCustomers) {
	//console.log(get_Customers);
	$("#DynamicBody").empty();
	var my2dArr = [];
	console.log(stringCustomers);
	// doing this after the customers could not be added during Planning ---START
	console.log(stringCustomers.length);
	var noOfSelectedCus = 0;
	// doing this after the customers could not be added during Planning ---END
	$.each(stringCustomers, function (key, val) {
		var custRecordId = val;
		ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: custRecordId }).then(
			function (data) {
				console.log(data);
				var custDetails = data.data;
				$.each(custDetails, function (key, val) {
					// console.log(val.Account_Name);
					// console.log(val.Area_SL);
					// console.log(val.id);
					var myStr = {
						Account_Name: val.Account_Name,
						id: val.id,
						Area: val.Area_SL,
					};
					console.log(Existing_Cus);
					console.log(Existing_Cus.length);
					if (Existing_Cus.length > 0) {
						var ExistingcusCounter = 0;
						var Existingcus = false;
						console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
						$.each(Existing_Cus, function (key3, val3) {
							console.log(val3.Name);
							console.log(val.Account_Name);
							ExistingcusCounter++;
							if (val3.Name == val.Account_Name) {
								Existingcus = true;
							}
							if (Existing_Cus.length == ExistingcusCounter) {
								// if (Existingcus == false) {
								my2dArr.push(myStr);
								// }
							}
						});
					} else {
						console.log("BBBBBBBBBBBBBbb");
						my2dArr.push(myStr);
					}
				});
				console.log(my2dArr);
				noOfSelectedCus++;
				console.log(stringCustomers.length);
				console.log(noOfSelectedCus);
				if (stringCustomers.length == noOfSelectedCus) {
					ZOHO.CRM.API.getAllRecords({
						Entity: "Product_Classification",
						sort_order: "asc",
						per_page: 100,
						page: 1,
					}).then(function (data) {
						var products = data.data;
						var html = "";
						$.each(my2dArr, function (key, val) {
							var counter = 1;
							var newRow = $("<tr>");
							var cols = "";
							cols +=
								'<td class="col-sm-4" id="customer_cnt">' +
								'<select class="form-control" name="customer">' +
								//'<option>-- Select --</option>';
								//$.each(my2dArr, function(key2, val2) {
								//var selected = (val2.id == val.Account_Name) ? "selected" : "";
								"<option value=" +
								val.id +
								" " +
								selected +
								">" +
								val.Account_Name +
								"</option>";
							//});
							cols += "</select>" + "</td>";
							cols +=
								'<td class="col-sm-4" id="customer_area">' +
								'<select class="form-control" name="customerArea">' +
								//'<option>-- Select --</option>'+
								// $.each(customers, function(key4,val4){
								//     var selected = (val4.id == val.Area)?"selected":"";
								//     console.log(val.Customer_Name.id);
								"<option selected value=" +
								val.Area +
								">" +
								val.Area +
								"</option>";
							//});
							cols += "</select>" + "</td>";
							cols +=
								'<td class="col-sm-4" id="product">' +
								'<select class="form-control" name="product" id= "Product_Classification" onchange = "handleSelectChange(event)">' +
								'<option value="">-- Select --</option>';
							$.each(products, function (key3, val3) {
								//console.log('PRODUCT CLASSIFICATION------------------');
								//console.log(val3);
								//console.log('PRODUCT CLASSIFICATION------------------');
								if (val.Product_Classification1 == null) {
									//cols += '<option value="">-- Select --</option>';
								} else {
									var selected =
										val3.id == val.Product_Classification1.id ? "selected" : "";
								}
								cols +=
									"<option value=" +
									val3.id +
									" " +
									selected +
									">" +
									val3.Name +
									"</option>";
								// else
								// {
								//    var selected = (val3.id == val.Product_Classification1.id)?"selected":"";
								//    cols += '<option value='+val3.id+' '+selected+'>'+val3.Name+'</option>';
								// }
								//$("#customer_Area"+areaCounter).append(area);
							});
							cols += "</select>" + "</td>";
							// console.log("Product_Calassification End");
							// console.log("Products");
							cols +=
								'<td class="col-sm-4">' +
								'<select class="form-control" name="products" id= "Products' +
								productCounter +
								'">' +
								'<option value="">-- Select --</option>';
							//console.log("test");
							// $.each(products, function(key5,val5){
							//       var selected = (val5.id == val.Product_Name.id)?"selected":"";
							// '<option selected value=' + product_id + '>' + product_name + '</option>';
							//   });
							cols += "</select>" + "</td>";
							cols +=
								'<td class="col-sm-4" id="purpose">' +
								'<select class="form-control" name="purpose">' +
								'<option value="">-- Select --</option>';
							var selected = val.Purpose == "Order" ? "selected" : "";
							cols += '<option value="Order" ' + selected + ">Order</option>";
							var selected =
								val.Purpose == "Non AMC Follow Up" ? "selected" : "";
							cols +=
								'<option value="Non AMC Follow Up" ' +
								selected +
								">Non AMC Follow Up</option>";
							var selected =
								val.Purpose == "Payment Collection" ? "selected" : "";
							cols +=
								'<option value="Payment Collection" ' +
								selected +
								">Payment Collection</option>";
							var selected = val.Purpose == "Demo" ? "selected" : "";
							cols += '<option value="Demo" ' + selected + ">Demo</option>";
							var selected = val.Purpose == "Lead" ? "selected" : "";
							cols += '<option value="Lead" ' + selected + ">Lead</option>";
							var selected = val.Purpose == "Follow Up" ? "selected" : "";
							cols +=
								'<option value="Follow Up" ' +
								selected +
								">Follow Up</option>" +
								"</select>" +
								"</td>";
							cols +=
								'<td class="col-sm-4">' +
								'<input type="text" class="form-control" name = "RelatedID" id="Related_ID">' +
								"</td>";
							// cols += '<td><input type="button" class="ibtnDel btn btn-md"  value="Delete" disabled></td>';
							cols +=
								'<td><button class="btn btn-primary submit" onclick="myFunction( \'' +
								val.id +
								"')\">Customer</button></td>";
							newRow.append(cols);
							$("table.order-list").append(newRow);
							counter++;
							$("table.order-list").on("click", ".ibtnDel", function (event) {
								$(this).closest("tr").remove();
								counter -= 1;
							});
						});
						productCounter++;
					});
				}
			}
		);
	}); //for each closing

	// ZOHO.CRM.API.getAllRecords({ Entity: "Product_Classification", sort_order: "asc", per_page: 100, page: 1 })
	// .then(function(data) {
	//     var products = data.data;
	//     var html = '';
	//     $.each(my2dArr, function(key, val) {
	//         var counter = 1;
	//         var newRow = $("<tr>");
	//         var cols = "";
	//         cols += '<td class="col-sm-4" id="customer_cnt">' +
	//             '<select class="form-control" name="customer">' +
	//             //'<option>-- Select --</option>';
	//         //$.each(my2dArr, function(key2, val2) {
	//             //var selected = (val2.id == val.Account_Name) ? "selected" : "";
	//             '<option value=' + val.id + ' ' + selected + '>' + val.Account_Name + '</option>';
	//         //});
	//         cols += '</select>' +
	//             '</td>';
	//         cols += '<td class="col-sm-4" id="customer_area">' +
	//             '<select class="form-control" name="customerArea">' +
	//             //'<option>-- Select --</option>'+
	//             // $.each(customers, function(key4,val4){
	//             //     var selected = (val4.id == val.Area)?"selected":"";
	//             //     console.log(val.Customer_Name.id);
	//             '<option selected value=' + val.Area + '>' + val.Area + '</option>';
	//         //});
	//         cols += '</select>' +
	//             '</td>';
	//         cols += '<td class="col-sm-4" id="product">' +
	//             '<select class="form-control" name="product" id= "Product_Classification" onchange = "handleSelectChange(event)">' +
	//             '<option value="">-- Select --</option>';
	//         $.each(products, function(key3, val3) {
	//             //console.log('PRODUCT CLASSIFICATION------------------');
	//             //console.log(val3);
	//             //console.log('PRODUCT CLASSIFICATION------------------');
	//             if (val.Product_Classification1 == null) {
	//                 //cols += '<option value="">-- Select --</option>';

	//             } else {
	//                 var selected = (val3.id == val.Product_Classification1.id) ? "selected" : "";
	//             }
	//             cols += '<option value=' + val3.id + ' ' + selected + '>' + val3.Name + '</option>';
	//             // else
	//             // {
	//             //    var selected = (val3.id == val.Product_Classification1.id)?"selected":"";
	//             //    cols += '<option value='+val3.id+' '+selected+'>'+val3.Name+'</option>';
	//             // }
	//             //$("#customer_Area"+areaCounter).append(area);

	//         });
	//         cols += '</select>' +
	//             '</td>';
	//         // console.log("Product_Calassification End");
	//         // console.log("Products");
	//         cols += '<td class="col-sm-4">' +
	//             '<select class="form-control" name="products" id= "Products' + productCounter + '">'+
	//             '<option value="">-- Select --</option>';
	//             //console.log("test");
	//             // $.each(products, function(key5,val5){
	//             //       var selected = (val5.id == val.Product_Name.id)?"selected":"";
	//             // '<option selected value=' + product_id + '>' + product_name + '</option>';
	//         //   });
	//         cols += '</select>' +
	//             '</td>';
	//         cols += '<td class="col-sm-4" id="purpose">' +
	//             '<select class="form-control" name="purpose">' +
	//             '<option value="">-- Select --</option>';
	//         var selected = (val.Purpose == "Order") ? "selected" : "";
	//         cols += '<option value="Order" ' + selected + '>Order</option>';
	//         var selected = (val.Purpose == "Non AMC Follow Up") ? "selected" : "";
	//         cols += '<option value="Non AMC Follow Up" ' + selected + '>Non AMC Follow Up</option>';
	//         var selected = (val.Purpose == "Payment Collection") ? "selected" : "";
	//         cols += '<option value="Payment Collection" ' + selected + '>Payment Collection</option>';
	//         var selected = (val.Purpose == "Demo") ? "selected" : "";
	//         cols += '<option value="Demo" ' + selected + '>Demo</option>';
	//         var selected = (val.Purpose == "Lead") ? "selected" : "";
	//         cols += '<option value="Lead" ' + selected + '>Lead</option>';
	//         var selected = (val.Purpose == "Follow Up") ? "selected" : "";
	//         cols += '<option value="Follow Up" ' + selected + '>Follow Up</option>' +
	//             '</select>' +
	//             '</td>';
	//         cols += '<td class="col-sm-4">' +
	//             '<input type="text" class="form-control" name = "RelatedID" id="Related_ID">' +
	//             '</td>';
	//         cols += '<td><input type="button" class="ibtnDel btn btn-md"  value="Delete" disabled></td>';
	//         newRow.append(cols);
	//         $("table.order-list").append(newRow);
	//         counter++;
	//         $("table.order-list").on("click", ".ibtnDel", function(event) {
	//             $(this).closest("tr").remove();
	//             counter -= 1
	//         });
	//     });
	//     productCounter++;
	// });
}; //Selected Customers Closing

//----------------------------------------------Creating Rows After Selecting Multiple Customers END-------------------------------

/*---------On Click Of Add Customer Adding One More Row START----------------*/
SJP.customers = function () {
	//console.log('one');
	$("#addCustomer").on("click", function () {
		$("#addCustomer").css("pointer-events", "none");
		// $("#addCustomer").attr('disabled', true);//-------Last option for more Add Customer Clicks------------
		//console.log('two');
		if ($("#userRole").val() != "RSM") {
			var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
			//console.log("three");
		} else {
			if ($("#selectedFieldWorkType").val() == "Independent") {
				var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
			} else {
				var selectedAreas = $(".selectpicker").val();
			}
		}
		//console.log(selectedAreas);
		if (selectedAreas) {
			//console.log('two');
			var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
			//console.log(selectedAreas);
			if (selectedAreas) {
				//console.log('Areas present');
				if (selectedAreas.length > 0) {
					//console.log('Areas no. present');

					//console.log(selectedAreas);

					var areas = selectedAreas;
					var formatedAreas = [];
					$.each(areas, function (key, val) {
						//console.log("'" + val + "'");

						formatedAreas.push("'" + val + "'");
					});
					//console.log(areas);
					var stringAreas = formatedAreas.toString();
					SJP.getCustomers(stringAreas);
				} else {
					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html("Please select Area..");
					$("#exampleModalCenter").modal("show");
				}
			} else {
				$("#exampleModalCenter .modal-title").html("Alert");
				$("#exampleModalCenter .modal-body").html("Please select Area..");
				$("#exampleModalCenter").modal("show");
			}
		}
		areaCounter++;
		productCounter++;
	});
};
/*---------On Click Of Add Customer Adding One More Row END----------------*/

/*---------Get customers based on area selected START----------------*/
SJP.getCustomers = function (areas) {
	// The Editing for new control flow is done from here
	//console.log("areas");
	//console.log(areas);
	//console.log('customers');
	// var config = {
	//     "select_query": 'select Account_Name from Accounts where (Area_SL in (' + areas + '))'
	// }
	// console.log(config);

	// ZOHO.CRM.API.coql(config).then(function(data) {
	//     var customers = data.data;
	var userHqId = $("#userHqId").val();
	//console.log(userHqId);
	//console.log("areas");
	//console.log('customers');
	//console.log("select Customer_Name from Sales_Hierarchy where Area_SL in (" + areas + ") and HQ = '" + userHqId + "' and BCL = 'Yes'");
	var config = {
		select_query:
			"select Customer_Name from Sales_Hierarchy where ((Area_SL in (" +
			areas +
			") and BCL = 'Yes') and HQ='" +
			userHqId +
			"')", //  "select_query": "select Customer_Name from Sales_Hierarchy where Area_SL in ('Rajakkad') and BCL = 'Yes' and HQ = '84320000000147376' "
		//and HQ = '84320000000147376'
		// and HQ = " + userHqId + "
	};
	//The Editing for new control flow ended here everything else remains the same
	//console.log(config);
	ZOHO.CRM.API.coql(config).then(function (data) {
		var customers = data.data;
		var myCusIdArr = [];
		var myCusnameArr = [];
		var my2dArr = [];
		var sortedCustomerArr;
		$.each(customers, function (key, val) {
			//console.log(customers);
			if (val.Customer_Name != null) {
				var CustRecordID = val.Customer_Name.id;
			}
			//console.log("Customer RecordID Start");
			//console.log(CustRecordID);
			//console.log("Customer RecordID End");
			ZOHO.CRM.API.getRecord({
				Entity: "Accounts",
				RecordID: CustRecordID,
			}).then(function (data) {
				//console.log(data);
				var CustomersData = data.data;
				$.each(CustomersData, function (key2, val2) {
					//console.log(val2.Account_Name);
					//console.log(val2.id);
					// myCusIdArr.push(val2.id);
					// myCusnameArr.push(val2.Account_Name);
					myStr = {
						Account_Name: val2.Account_Name,
						id: val2.id,
					};
					my2dArr.push(myStr);

					// $('#AddCustomers').append('<option value='+val2.id+'>'+ val2.Account_Name +'</option>');
					// $('#AddCustomers').append('<option value='84320000000433379'>'S.N TRUST HOSPITAL'</option>');
				}); //inner foreach loop
				//console.log(my2dArr);
				sortedCustomerArr = my2dArr.sort(function (a, b) {
					return a.Account_Name.localeCompare(b.Account_Name);
				});
				//console.log(sortedCustomerArr);
			}); //getRecord closing
		}); //foreach closing
		ZOHO.CRM.API.getAllRecords({
			Entity: "Product_Classification",
			sort_order: "asc",
			per_page: 100,
			page: 1,
		}).then(function (data) {
			var products = data.data;
			//console.log('customers data');
			//console.log(data);
			if (customers) {
				if (customers.length > 0) {
					var counter = 1;
					//console.log(customers.length);
					//console.log(customers);
					var newRow = $("<tr>");
					var cols = "";
					cols +=
						'<td class="col-sm-4">' +
						'<select class="form-control" name="customer" id ="AddCustomers"  onchange = "AreaSelectChange(event,' +
						areaCounter +
						')">' +
						"<option>-- Select --</option>";
					$.each(sortedCustomerArr, function (key, val8) {
						cols +=
							"<option value=" +
							val8.id +
							">" +
							val8.Account_Name +
							"</option>";
					});
					cols += "</select>" + "</td>";
					//console.log("Areas");
					cols +=
						'<td class="col-sm-4">' +
						'<select class="form-control" name="customerArea" id= "customer_Area' +
						areaCounter +
						'">' +
						'<option value="">-- Select --</option>';
					cols += "</select>" + "</td>";
					//console.log("Product_Calassification");
					cols +=
						'<td class="col-sm-4">' +
						'<select class="form-control" name="product" id= "Product_Classification" onchange = "handleSelectChange(event)">' +
						'<option value="">-- Select --</option>';
					//console.log("test");
					$.each(products, function (key2, val2) {
						//console.log(val2);
						//cols += '<option value="' + val2.id +'"  onclick = "showProducts('+val2.id+')">'+val2.Name+'</option>';
						cols +=
							'<option value="' + val2.id + '">' + val2.Name + "</option>";
					});
					cols += "</select>" + "</td>";
					//console.log("Product_Calassification End");
					//console.log("Products");
					cols +=
						'<td class="col-sm-4">' +
						'<select class="form-control products" name="products" id= "Products' +
						productCounter +
						'">' +
						'<option value="">-- Select --</option>';
					cols += "</select>" + "</td>";
					//console.log("Products End");
					cols +=
						'<td class="col-sm-4">' +
						'<select class="form-control" name="purpose">' +
						'<option value="">-- Select --</option>' +
						'<option selected value="Non AMC Follow Up">Non AMC Follow Up</option>' +
						'<option value="Follow Up">Follow Up</option>' +
						"</select>" +
						"</td>";
					//console.log("Related ID");
					cols +=
						'<td class="col-sm-4">' +
						'<input type="text" class="form-control" name = "RelatedID" id="Related_ID">' +
						"</td>";
					// cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
					cols +=
						'<td><button class="btn btn-primary submit" onclick="myFunction( \'' +
						val8.id +
						"')\">Customer</button></td>";
					newRow.append(cols);
					$("table.order-list").append(newRow);
					counter++;
					$("table.order-list").on("click", ".ibtnDel", function (event) {
						$(this).closest("tr").remove();
						counter -= 1;
					});
				} else {
					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html(
						"Customers not found for selected Areas.."
					);
					$("#exampleModalCenter").modal("show");
				}
			} else {
				$("#exampleModalCenter .modal-title").html("Alert");
				$("#exampleModalCenter .modal-body").html(
					"Customers not found for selected Areas.."
				);
				$("#exampleModalCenter").modal("show");
			}
		});
		//console.log('customers2');
	});
};
// }
/*---------Get customers based on area selected END----------------*/
/*------------------Approve or Reject START-----------------------*/
SJP.updateTpStatus = function (UserName, UserId, Status, message) {
	var curr_date = new Date();
	SJP.status = Status;
	var current_date = cal.calMonth + "-" + cal.calYear;
	// console.log("SJP_Month" + current_date);
	// console.log("Approval_Status" + Status);
	// console.log('id' + UserId);
	// console.log('CurrentUserName' + UserName);
	if (Status == "Rejected") {
		SJP.reject_reason = message;
		// console.log(SJP.reject_reason);
		var recordData = {
			SJP_Month: current_date,
			Approval_Status: Status,
			Rejection_Reason: message,
			Owner: {
				name: UserName,
				id: UserId,
			},
		};
	} else {
		var recordData = {
			SJP_Month: current_date,
			Approval_Status: Status,
			Owner: {
				name: UserName,
				id: UserId,
			},
		};
	}
	ZOHO.CRM.API.insertRecord({
		Entity: "SJP_Approvals",
		APIData: recordData,
		Trigger: ["workflow"],
	}).then(function (data) {
		//console.log(data);
		if (Status == "Sent") {
			sendApprovalUpdate(1, "Approval Pending");
			$("#send-approval").attr("disabled", true);
			// $('#delete').show();
			$(".fc-event-inner").css("background", "orange");
		}
		if (Status == "Approved") {
			$(".fc-event-inner").css("background", "green");
			// $('#delete').hide();
		}
		if (Status == "Rejected") {
			$(".fc-event-inner").css("background", "red");
			// $('#delete').show();
			sendApprovalUpdate(0, "SJP Rejected");
		}
	});
};
/*------------------Approve or Reject END-----------------------*/

/*----ON Page Load Fetching The Events And Rendering Events In The Calender  START---*/
SJP.setUpCal = function (UserId) {
	SJP.is_Modified = 0;
	SJP.is_Deviated = 0;
	SJP.is_Draft = 0;
	SJP.is_Sent = 0;
	$("#calendar").fullCalendar("removeEvents");
	var logged_User = SJP.logged_User;
	var curr_date = new Date();
	//console.log(SJP);
	var current_date = cal.calMonth + "-" + cal.calYear;
	var currUsrId = UserId;
	ZOHO.CRM.API.searchRecord({
		Entity: "SJP_CRM",
		Type: "criteria",
		Query:
			"((SJP_Month:equals:" +
			current_date +
			")and(Owner:equals:" +
			currUsrId +
			"))",
	}).then(function (data) {
		// console.log("Data");
		// console.log(data);
		// console.log(data.statusText);
		if (data.statusText == "nocontent") {
			//console.log("Test");
			$("#send-approval").hide();
			SJP.status = "Draft";
			$("#approve").hide();
		}
		//console.log("Data");
		var noOfEventsInAMonth = data.data.length;
		SJP.noOfEventsInAMonth = noOfEventsInAMonth;
		let status = [];
		$.each(data.data, function (key, val) {
			//console.log(val);
			if (key == 0) {
				SJP.status = val.Approval_Status;
			}
			$("#userRole").val(val.Role);
			SJP.status = val.Approval_Status;
			// if (val.Areas_Planned != null) {
			//   var title_data = val.Activity_type + "-" + val.Area_Type + "-" + val.Areas_Planned;

			// }
			// if(val.Area_Type != null)
			// {
			//   var title_data = val.Activity_type + "-" + val.Area_Type + "-" + val.Areas_Planned;

			// }
			// else
			// {
			//    var title_data = val.Activity_type;
			// }

			var title_data = val.BackendTitle;
			// let name = val.Name;
			// console.log("val" + val.Approval_Status);
			// if (key == 0) {
			//     SJP.status = val.Approval_Status;
			// }
			// status.push(val.Approval_Status);
			// SJP.status = val.Approval_Status;
			// console.log("setUpCal Status" + SJP.status)
			// if (val.Areas == null) {
			//     val.Areas = '';
			// }
			// var title_data = val.Name;
			// console.log("setUpCal LOGGEDIN USER" + logged_User);
			// console.log("setUpCal CURRENT USER" + currUsrId);

			//Showing Approve button in RSM Role Nares End
			if (logged_User == currUsrId) {
				//console.log("A");
				if (SJP.status == "Draft") {
					// console.log("B");
					sendApprovalUpdate(1, "Send For Approval");
					$("#send-approval").attr("disabled", false);
					$("#approve").hide();
					//   $('#delete').show();
				}
				if (SJP.status == "Sent") {
					//console.log("C");
					sendApprovalUpdate(1, "Pending Approval");
					$("#send-approval").attr("disabled", true);
					$("#approve").hide();
				}
				if (SJP.status == "Approved") {
					//console.log("D");

					sendApprovalUpdate(1, "SJP Approved");
					$("#send-approval").attr("disabled", true);
					$("#approve").hide();
				}
				if (SJP.status == "Rejected") {
					// console.log("E");
					sendApprovalUpdate(1, "SJP Rejected");
					//   $('#delete').show();
					$("#send-approval").attr("disabled", true);
					$("#approve").hide();
				}
				if (
					(SJP.status == "Approved" && SJP.is_Deviated == 1) ||
					(SJP.status == "Approved" && SJP.is_Draft == 1)
				) {
					//console.log("K");
					sendApprovalUpdate(1, "Send For Approval");
					$("#send-approval").attr("disabled", false);
					$("#approve").hide();
					//   $('#delete').show();
				}
				if (SJP.status == "Approved" && SJP.is_Sent == 1) {
					// console.log("C");
					sendApprovalUpdate(1, "Pending Approval");
					$("#send-approval").attr("disabled", true);
					$("#approve").hide();
				}
				if (SJP.is_Modified == 1 || SJP.is_Deviated == 1 || SJP.is_Draft == 1) {
					// console.log("F");
					sendApprovalUpdate(1, "Send For Approval");
					$("#send-approval").attr("disabled", false);
					$("#approve").hide();
					//   $('#delete').show();
				}
			} else {
				//console.log("G");
				if (SJP.status == "Draft" && logged_User != currUsrId) {
					$("#approve").hide();
					sendApprovalUpdate(0, "Send For Approval");
					//   $('#delete').show();
				}
				if (
					(SJP.status == "Sent" && logged_User != currUsrId) ||
					(SJP.status == "Deviated" && logged_User != currUsrId) ||
					(SJP.status == "Modified" && logged_User != currUsrId)
				) {
					//console.log("H");
					$("#approve").show();
					sendApprovalUpdate(0, "Pending Approval");
				}
				if (SJP.status == "Approved" && logged_User != currUsrId) {
					//console.log("I");
					$("#approve").hide();
					sendApprovalUpdate(0, "SJP Approved");
				}
				if (val.Approval_Status == "Rejected" && logged_User != currUsrId) {
					//console.log("J");
					$("#approve").hide();
					sendApprovalUpdate(0, "SJP Rejected");
					//   $('#delete').show();
				}
				if (SJP.status == "Approved" && logged_User != currUsrId) {
					if (
						(SJP.is_Deviated == 1 && logged_User != currUsrId) ||
						(SJP.is_Sent == 1 && logged_User != currUsrId)
					) {
						//console.log('Modified Inner');
						$("#approve").show();
						sendApprovalUpdate(0, "Send For Approval");
						$("#send-approval").attr("disabled", false);
					}
				}
				// if((SJP.is_Modified == 1 && logged_User != currUsrId) || (SJP.is_Deviated == 1 && logged_User != currUsrId) || (SJP.is_Draft == 1 && logged_User != currUsrId))
				// {
				//   console.log('Modified Inner');
				//   $('#approve').show();
				//   sendApprovalUpdate(0, "Send For Approval");
				//   $("#send-approval").attr('disabled', false);
				// }
			}
			//Showing Approve button in RSM Role Nares End
			if (SJP.status == "Draft") {
				SJP.is_Draft = 1;
				var eventObj = {
					title: title_data,
					start: val.Date,
					event_id: val.id,
					color: "gray",
					textColor: "#fff",
				};
			}
			if (SJP.status == "Sent") {
				SJP.is_Sent = 1;
				var eventObj = {
					title: title_data,
					start: val.Date,
					event_id: val.id,
					color: "orange",
					textColor: "#fff",
				};
			}
			if (SJP.status == "Approved") {
				var eventObj = {
					title: title_data,
					start: val.Date,
					event_id: val.id,
					color: "green",
					textColor: "#fff",
				};
			}
			//console.log('status is' + SJP.status);
			if (val.Approval_Status == "Rejected") {
				var eventObj = {
					title: title_data,
					start: val.Date,
					event_id: val.id,
					color: "red",
					textColor: "#fff",
				};
			}
			if (val.Approval_Status == "Modified") {
				SJP.is_Modified = 1;
				var eventObj = {
					title: title_data,
					start: val.Date,
					event_id: val.id,
					color: "#A45EA1",
					textColor: "#fff",
				};
			}
			if (val.Approval_Status == "Deviated") {
				SJP.is_Deviated = 1;
				var eventObj = {
					title: title_data,
					start: val.Date,
					event_id: val.id,
					color: "#2E9AFE",
					textColor: "#fff",
				};
			}
			$("#calendar").fullCalendar("renderEvent", eventObj, true);
			$("#cancel").click();
			$(".field-work-day").hide();
			$(".staffName").hide();
			var emptyVal = "";
			$(".FlspHq").val(emptyVal);
			$(".FlspHq").hide();
		});
		//console.log('__________________________________ uday');
		//console.log(SJP.status);
	});
};
/*----ON Page Load Fetching The Events And Rendering Events In The Calender  END---*/
/*---- Get All Customers in edit event----*/
SJP.getAllCustomers = function (get_customers, areas) {
	Existing_Cus = [];
	// console.log('customers');
	console.log(get_customers);
	// console.log(areas);
	//$("#Area_Selector").val( areas );
	$.each(get_customers, function (key2, val2) {
		var myStr = {
			Name: val2.Customer_Name.name,
			// id : val2.Customer_Name.name,
			// Area : val2.Area,
			// Product_Classification : val2.Product_Classification1,
			// Product_Name : val2.Product_Name,
			// Purpose : val2.Purpose,
			// RelatedID: val2.Related_Id
		};
		Existing_Cus.push(myStr);
	});
	console.log(Existing_Cus);
	var config = {
		select_query:
			"select Account_Name from Accounts where (Area_SL in (" + areas + "))",
	};
	// console.log(config);
	ZOHO.CRM.API.coql(config).then(function (data) {
		// console.log(data);
		// console.log('customers data');
		// console.log(data);
		var customers = data.data;
		ZOHO.CRM.API.getAllRecords({
			Entity: "Product_Classification",
			sort_order: "asc",
			per_page: 100,
			page: 1,
		}).then(function (data) {
			var products = data.data;
			// console.log('customers data');
			// console.log(data);
			// console.log('cust1');
			// console.log(customers);
			// console.log('cust');
			var html = "";
			$.each(get_customers, function (key, val) {
				// alert(val.Related_Id);
				// console.log("Innser Customers")
				// console.log(SJP.Selected_User);
				// console.log(SJP.logged_User);
				// console.log(val);
				// console.log('Non Amc Condition');
				// if((val.Purpose == "Non AMC Follow Up" && SJP.Approve_Status_onclick_event != 'Sent') && (SJP.Selected_User == SJP.logged_User))
				// {
				//   console.log('A');
				//   $('.submit').attr('disabled',false);
				// }
				// else
				// {
				//   console.log('B');
				//   $('.submit').attr('disabled',true);
				// }
				// if((val.Purpose == "Complaints" || val.Purpose == "installation" || val.Purpose == "Demo Assistance") && (SJP.Selected_User == SJP.logged_User))
				// {
				//   console.log('C');
				//   $('.submit').attr('disabled',true);
				// }
				// else
				//     $('.submit').attr('disabled',false);
				// console.log('Non Amc condition End');
				var addnum = addnum + 1;
				// console.log("addnum : " + addnum);
				// console.log(val.Customer_Name.id);
				// console.log("2");
				// console.log(customers);
				// console.log("2End");
				var counter = 1;
				// var newRow = $("<tr data-id='" + val.id + "'>");
				var cols = "<tr data-id='" + val.id + "'>";
				cols +=
					'<td class="col-sm-4">' +
					'<select class="form-control" name="customer">' +
					//'<option>-- Select --</option>'+
					// $.each(customers, function(key2,val2){
					//     var selected = (val2.id == val.Customer_Name.id)?"selected":"";
					//     console.log(val.Customer_Name.name);
					"<option selected value=" +
					val.Customer_Name.id +
					">" +
					val.Customer_Name.name +
					"</option>";
				// });
				cols += "</select>" + "</td>";
				cols +=
					'<td class="col-sm-4">' +
					'<select class="form-control" name="customerArea">' +
					//'<option>-- Select --</option>'+
					// $.each(customers, function(key4,val4){
					//     var selected = (val4.id == val.Area)?"selected":"";
					//     console.log(val.Customer_Name.id);
					"<option selected value=" +
					val.Area +
					">" +
					val.Area +
					"</option>";
				//});
				cols += "</select>" + "</td>";
				//console.log("Product_Calassification");
				let product_name =
					val.Product_Classification1 != null
						? val.Product_Classification1.name
						: "--";
				//let product_id = val.Product_Name != null ? val.Product_Name.id : '--';
				cols +=
					'<td class="col-sm-4">' +
					'<select class="form-control" name="product">' +
					//'<option>-- Select --</option>'+
					// console.log("test");
					// $.each(products, function(key3,val3){
					// var selected = (val3.id == val.Product_Classification1.id)?"selected":"";

					"<option selected value=" +
					product_name +
					">" +
					product_name +
					"</option>";
				// });
				cols += "</select>" + "</td>";
				// console.log("Product_Calassification End");
				// console.log("Products");
				let product = val.Product_Name != null ? val.Product_Name.name : "--";
				// if(val.Product_Name != null ){
				//     let product = val.Product_Name.name;
				// }
				// else{
				//     let product = '--';
				// }
				cols +=
					'<td class="col-sm-4">' +
					'<select class="form-control" name="products">' +
					//'<option>-- Select --</option>'+
					//console.log("test");
					// $.each(products, function(key5,val5){
					//       var selected = (val5.id == val.Product_Name.id)?"selected":"";

					"<option selected value=" +
					product +
					">" +
					product +
					"</option>";
				//   });
				cols += "</select>" + "</td>";
				//console.log("Purpose");
				cols +=
					'<td class="col-sm-4">' +
					'<select class="form-control" name="purpose">' +
					// '<option>-- Select --</option>'+
					// $.each(products, function(key6,val6){
					//   var selected = (val6.id == val.Purpose)?"selected":"";
					'<option selected value="' +
					val.Purpose +
					'">' +
					val.Purpose +
					"</option>";
				//});
				// var selected = (val.Purpose== val.Purpose)?"selected":"";
				//  cols += '<option value="Order" '+selected+'>'+  val.Purpose +'</option>';
				//  var selected = (val.Purpose=="Payment Collection")?"selected":"";
				//  cols += '<option value="Payment Collection" '+selected+'>Payment Collection</option>';
				//  var selected = (val.Purpose=="Demo")?"selected":"";
				//  cols += '<option value="Demo" '+selected+'>Demo</option>';
				//   var selected = (val.Purpose=="Lead")?"selected":"";
				//  cols += '<option value="Lead" '+selected+'>Lead</option>'+
				"</select>" + "</td>";
				//console.log("Related ID");
				cols +=
					'<td class="col-sm-4">' +
					//  val.Related_Id
					'<input type="text" class="form-control" name = "RelatedID" id="Related_ID" value="' +
					val.Related_Record +
					'">' +
					"</td>";
				if (
					val.Purpose == "Complaints" ||
					val.Purpose == "Preventive Maintenance"
				) {
					// cols += '<td>'+'<input type="text"  name = "ServiceItem" id="Service_Item" value="' + val.Service_Item + '">' +
					// '</td>';
					cols +=
						'<td class="col-sm-4">' +
						'<select class="form-control"  name = "ServiceItem" id="Service_Item">' +
						'<option selected value="' +
						val.Service_Item +
						'">' +
						val.Service_Item +
						"</option>";
					"</select>" + "</td>";
				}
				// cols += '<td><input type="button" class="ibtnDel btn btn-md "  value="Delete" disabled></td>';
				cols +=
					'<td><button class="btn btn-primary submit" onclick="myFunction( \'' +
					val.Customer_Name.id +
					"')\">Customer</button></td>";
				cols += "</tr>";
				// console.log('__________________Uday ');
				// console.log(val.Related_Id);
				// newRow.append(cols);
				//$("table.order-list").append(cols);
				// $("#DynamicBody2").append(cols);
				$("#DynamicBody").append(cols);
				counter++;
				//$("table.order-list").on("click", ".ibtnDel", function(event) {
				// $("DynamicBody2").on("click", ".ibtnDel", function (event) {
				$("DynamicBody").on("click", ".ibtnDel", function (event) {
					$(this).closest("tr").remove();
					counter -= 1;
				});
			});
		});
		//console.log('customers2');
	});
};
SJP.updateTpSentStatus = function (UserId, Status, UserName) {
	//console.log("updateTpSentStatus Start");
	SJP.status = Status;
	var current_date = cal.calMonth + "-" + cal.calYear;
	var recordData = {
		SJP_Month: current_date,
		Approval_Status: Status,
		Owner: {
			name: UserName,
			id: UserId,
		},
	};
	ZOHO.CRM.API.insertRecord({
		Entity: "SJP_Approvals",
		APIData: recordData,
		Trigger: ["workflow"],
	}).then(function (data) {
		sendApprovalUpdate(1, "Pending Approval");
		$("#send-approval").attr("disabled", true);
		$(".fc-event-inner").css("background", "orange");
	});
	//console.log("updateTpSentStatus End");
};
/* ----Get Staff customers---- START*/
SJP.staffGetAllCustomers = function (get_customers) {
	// $("#DynamicBody").empty();
	//$("#DynamicBody").empty();
	console.log("staffGetAllCustomers");
	//   console.log(get_customers);
	//   console.log('staffGetAllCustomers');

	var CustomersData = get_customers;
	$.each(CustomersData, function (key, val) {
		console.log("SS:SubformRow Data", val);
		// console.log("ABCD");
		// console.log(val);
		// console.log(val.Customer_Name.name);
		// console.log(val.Area);
		// console.log(val.Product_Classification1.name);
		//console.log(val.Product_Name.name);
		// console.log(val.Purpose);
		// console.log(val.Related_Record);
		// console.log("EFGH");
		var counter = 1;
		var newRow = $("<tr>");
		var cols = "";
		cols +=
			'<td class="col-sm-4" id="customer_cnt">' +
			'<select class="form-control" name="customer">';
		cols +=
			"<option value=" +
			val.Customer_Name.id +
			" " +
			selected +
			">" +
			val.Customer_Name.name +
			"</option>";
		cols += "</select>" + "</td>";
		cols +=
			'<td class="col-sm-4">' +
			'<select class="form-control" name="customerArea">' +
			//'<option>-- Select --</option>'+
			// $.each(customers, function(key4,val4){
			//     var selected = (val4.id == val.Area)?"selected":"";
			//     console.log(val.Customer_Name.id);
			"<option selected value=" +
			val.Area +
			">" +
			val.Area +
			"</option>";
		//});
		cols += "</select>" + "</td>";
		cols +=
			'<td class="col-sm-4" id="product">' +
			'<select class="form-control" name="product">';
		if (val.Product_Classification1 == null) {
			cols += '<option value="">-- Select --</option>';
		} else {
			cols +=
				"<option value=" +
				val.Product_Classification1.id +
				" " +
				selected +
				">" +
				val.Product_Classification1.name +
				"</option>";
		}
		cols += "</select>" + "</td>";
		var Product_Name = val.Product_Name;
		if (Product_Name != null) {
			var Product_Name_Id = val.Product_Name.id;
			var Product_Name_Name = val.Product_Name.name;
		} else {
			var Product_Name_Id = "";
			var Product_Name_Name = "";
		}
		cols +=
			'<td class="col-sm-4">' +
			'<select class="form-control" name="products">' +
			//'<option>-- Select --</option>'+
			//console.log("test");
			// $.each(products, function(key5,val5){
			//       var selected = (val5.id == val.Product_Name.id)?"selected":"";

			"<option selected value=" +
			Product_Name_Id +
			">" +
			Product_Name_Name +
			"</option>";
		//   });
		cols += "</select>" + "</td>";
		cols +=
			'<td class="col-sm-4" id="purpose">' +
			'<select class="form-control" name="purpose">';
		var selected = val.Purpose == "Non AMC Follow Up" ? "selected" : "";
		cols +=
			'<option value="Non AMC Follow Up" ' +
			selected +
			">Non AMC Follow Up</option>";
		var selected = val.Purpose == "Complaints" ? "selected" : "";
		cols += '<option value="Complaints" ' + selected + ">Complaints</option>";
		var selected = val.Purpose == "Follow Up" ? "selected" : "";
		cols += '<option value="Follow Up" ' + selected + ">Follow Up</option>";
		var selected = val.Purpose == "Installation" ? "selected" : "";
		cols +=
			'<option value="Installation" ' + selected + ">Installation</option>";
		var selected = val.Purpose == "Demo Assistance" ? "selected" : "";
		cols +=
			'<option value="Demo Assistance" ' +
			selected +
			">Demo Assistance</option>" +
			"</select>" +
			"</td>";
		//console.log("Related ID");
		cols +=
			'<td class="col-sm-4">' +
			//  val.Related_Id
			'<input type="text" class="form-control" name = "RelatedID" id="Related_ID" value="' +
			val.Related_Record +
			'">' +
			"</td>";
		// cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
		cols +=
			'<td><button class="btn btn-primary submit" onclick="myFunction( \'' +
			val.Customer_Name.id +
			"')\">Customer</button></td>";
		newRow.append(cols);
		$("table.order-list").append(newRow);
		console.log("SS:Customer Row Inserted");
		counter++;
		$("table.order-list").on("click", ".ibtnDel", function (event) {
			$(this).closest("tr").remove();
			counter -= 1;
		});
	});
	//-------------------------------------------------
	var my2dArr = [];
	var otherCus = "";
	$.each(CustomersData, function (key2, val2) {
		var myStr = {
			Account_Name: val2.Customer_Name.name,
			id: val2.Customer_Name.id,
		};
		my2dArr.push(myStr);
	});
	$.each(my2dArr, function (key3, val3) {
		otherCus +=
			"<option selected value=" +
			val3.id +
			">" +
			val3.Account_Name +
			"</option>";
	});
	$("#customer_Selector").html(otherCus);
	$("#customer_Selector").selectpicker("refresh");
	//----------------------------------------------------
}; //inner foreach loop
/* ----Get Staff customers----END*/
//----------------------------------------------------------------------------

//--------------------------------------//
function myFunction(ID) {
	// alert(ID);
	var url = "https://crm.zoho.in/crm/org60003118478/tab/Accounts/";
	console.log(url + ID);
	window.open(url + ID);
}
//--------------------------------------//

//Added new updated code by Naresh End

function handleSelectChange(event) {
	var selectElement = event.target;
	var value = selectElement.value;
	//alert(value);
	console.log(value);
	var counter = productCounter - 1;
	ZOHO.CRM.API.searchRecord({
		Entity: "Products",
		Type: "criteria",
		Query: "(Product_Classification1:equals:" + value + ")",
	}).then(function (data) {
		console.log(data);
		console.log(data.data[0].Product_Name);
		console.log(data.data[0].id);
		var products = "";
		$.each(data.data, function (key, val) {
			products +=
				'<option value = "' + val.id + '">' + val.Product_Name + "</option>";
		});
		//console.log("Printing all products : " + products);
		// $("#Products" + productCounter).append(products);
		// $("#Products" + productCounter).selectpicker('refresh');
		$("#Products" + counter).append(products);
		$("#Products" + counter).selectpicker("refresh");
		//productCounter++;
	});
}

function AreaSelectChange(event, area_counter) {
	var counter_area = area_counter;
	var selectElement = event.target;
	var value = selectElement.value;
	//console.log(counter_area);

	ZOHO.CRM.API.getRecord({ Entity: "Accounts", RecordID: value }).then(
		function (data) {
			// console.log(data);
			// console.log(data.data[0].Area_SL);
			var areaOfCust = data.data[0].Area_SL;
			// console.log("one");
			var area = "";
			$.each(data.data, function (key, val) {
				area +=
					'<option  selected value = "' +
					areaOfCust +
					'">' +
					areaOfCust +
					"</option>";
			});
			// console.log("Printing area : " + area);
			$("#addCustomer").css("pointer-events", "auto");
			$("#customer_Area" + counter_area).append(area);
			$("#customer_Area" + counter_area).selectpicker("refresh");
			//areaCounter++;
			//console.log(areaCounter);
			//$("#addCustomer").attr('enabled', true);//-------Last option for more Add Customer Clicks------------
		}
	);
}

//----------------------------------------------------------------------------------------------------------------------------------
