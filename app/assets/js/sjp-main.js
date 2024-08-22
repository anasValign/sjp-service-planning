//my code
var SSOtherAreas;
var selectedYear = "";
var userHQID;
var customSortSelectAreas = [];
/*---Storing Month And */
var cal = {
	calMonth: "",
	calYear: "",
};
var purposeForAreaCondition;
/* calendar JS */
var selectedYear = "";
var calendarEventClickedObj;
var SJP = {};
var SJP = {
	is_sjp: 0,
	status: null,
	Selected_User: null,
	Selected_UserName: null,
	logged_User: null,
	currentUserName: null,
	userRole: null,
	noOfWorkingDays: null,
	noOfEventsInAMonth: 0,
	is_edit: 0,
	with_Staffid: null,
	with_Staffname: null,
	checkAreaChange: 0,
	reject_reason: null,
	eventIdForDelete: null,
	Approve_Status_onclick_event: null,
	is_Modified: 0,
	is_Deviated: 0,
	is_Draft: 0,
	is_Sent: 0,
	is_backendEvent: false,
	Backendevent_title: null,
	//customers_exp:null,
	Planned_Cus: [],
	Planned_Area: [],
};
$(function () {
	SJP.Init();
});

SJP.Init = function () {
	SJP.setupSendApproval();
};
SJP.setupSendApproval = function () { };
var areasPreSelectedArray;
var CusFromSubform = [];
$(document).ready(function () {
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	$("#cancel").click(function (e) {
		e.preventDefault();
		CusFromSubform = [];
		$("#wrap").show();
		$("#formScreen").hide();
		$(".field-work-day").hide();
		$(".staffName").hide();
		$(".FlspHq").val("");
		$(".FlspHq").hide(); // to be changed
		$("#selectActivity").val("").trigger("change");
		SJP.Planned_Cus = [];
		customSortSelectAreas = [];
	});
	$("#reset").click(function (e) {
		e.preventDefault();
		CusFromSubform = [];
		$(".field-work-day").hide();
		$(".staffName").hide();
		$(".FlspHq").val("");
		$(".FlspHq").hide(); //to be changed
		$("#selectActivity").val("").trigger("change");
		customSortSelectAreas = [];
	});
	// $('#delete').click(function(e) {
	//     e.preventDefault();
	//     CusFromSubform = [];
	//     console.log(SJP.eventIdForDelete);
	//     var event_id = SJP.eventIdForDelete;
	//     deleteEvent(event_id);

	// });
	$("#users-list").change(function () {
		var UserId = $("#users-list").val();
		var Selected_UserName = $('[name="user-list"] option:selected').text();
		SJP.Selected_User = UserId;
		SJP.Selected_UserName = Selected_UserName;
		SJP.setUpCal(UserId);
	});

	$("#approve_status").click(function () {
		var Approve = $.data(val);
	});
	/* initialize the external events
	-----------------------------------------------------------------*/
	$("#external-events div.external-event").each(function () {
		// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
		// it doesn't need to have a start or end
		var eventObject = {
			title: $.trim($(this).text()), // use the element's text as the event title
		};

		// store the Event Object in the DOM element so we can get to it later
		$(this).data("eventObject", eventObject);

		// make the event draggable using jQuery UI
		$(this).draggable({
			zIndex: 999,
			revert: true, // will cause the event to go back to its
			revertDuration: 0, //  original position after the drag
		});
	});
	/* initialize the calendar
	-----------------------------------------------------------------*/
	var calendar = $("#calendar").fullCalendar({
		header: {
			left: "title",
			// center: 'month',
			right: "prev,next",
		},
		editable: true,
		eventDrop: function (
			event,
			dayDelta,
			minuteDelta,
			allDay,
			revertFunc,
			date
		) {
			var curr_date = new Date();
			var selectedDay = event.start.getDate();
			var selectedMonth = event.start.getMonth() + 1;
			console.log(event.start.getDay());
			var selectedYear = event.start.getFullYear();
			var current_date =
				curr_date.getFullYear() +
				"-" +
				(curr_date.getMonth() + 1) +
				"-" +
				curr_date.getDate();
			var selected_date =
				selectedYear + "-" + selectedMonth + "-" + selectedDay;
			var events = $("#calendar").fullCalendar("clientEvents");
			var current_date_events = "";
			var cehckDays = [];
			var droppableMonth = event.start.getMonth() + 1;
			for (var i = 0; i < events.length; i++) {
				var start_date = new Date(events[i].start);
				var end_date = "";
				var st_day = start_date.getDate();
				cehckDays.push(st_day);
				var st_monthIndex = start_date.getMonth() + 1;
				var st_year = start_date.getFullYear();
				var event_date = st_year + "-" + st_monthIndex + "-" + st_day;
				if (event_date == selected_date) {
					current_date_events = event_date;
				}
			}
			// console.log(cehckDays);
			var currDay = event.start.getDate();
			// console.log(currDay);
			var numOccurences = $.grep(cehckDays, function (elem) {
				return elem === currDay;
			}).length;
			console.log(numOccurences);
			console.log("SM" + selectedMonth);
			console.log("CM" + cal.calMonth);
			if (cal.calMonth != selectedMonth) {
				console.log("1");
				revertFunc();
			} else {
				if (numOccurences > 8) {
					console.log("2");
					revertFunc();
				} else if (event.start.getDay() == 0) {
					// revertFunc();
					//Naresh allowing to drop event on sunday
					var event_year = event.start.getFullYear();
					var event_month = event.start.getMonth() + 1;
					var event_day = event.start.getDate().toString().padStart(2, "0");
					if (event_month < 10) {
						event_month = "0" + event_month;
					}
					var formate_date = event_year + "-" + event_month + "-" + event_day;
					console.log(formate_date);
					console.log(cal);
					event_id = event.event_id;
					var config = {
						Entity: "SJP_CRM",
						APIData: {
							id: event_id,
							Date: formate_date,
						},
						Trigger: ["workflow"],
					};
					ZOHO.CRM.API.updateRecord(config).then(function (data) { });
					//Naresh allowing to drop event on sunday End
				} else {
					var event_year = event.start.getFullYear();
					var event_month = event.start.getMonth() + 1;
					var event_day = event.start.getDate().toString().padStart(2, "0");
					if (event_month < 10) {
						event_month = "0" + event_month;
					}
					var formate_date = event_year + "-" + event_month + "-" + event_day;
					console.log(formate_date);
					console.log(cal);
					event_id = event.event_id;
					var config = {
						Entity: "SJP_CRM",
						APIData: {
							id: event_id,
							Date: formate_date,
						},
						Trigger: ["workflow"],
					};
					ZOHO.CRM.API.updateRecord(config).then(function (data) { });
				}
			}
		},
		firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
		selectable: true,
		defaultView: "month",

		axisFormat: "h:mm",
		columnFormat: {
			month: "ddd", // Mon
			week: "ddd d", // Mon 7
			//day: 'dddd M/d',  // Monday 9/7
			agendaDay: "dddd d",
		},
		titleFormat: {
			month: "MMMM yyyy", // September 2009
			week: "MMMM yyyy", // September 2009
			//day: 'MMMM yyyy'                  // Tuesday, Sep 8, 2009
		},
		allDaySlot: false,
		selectHelper: true,
		select: function (day, date, month, start, end, allDay, jsEvent, view) {
			var current_date = cal.calMonth + "-" + cal.calYear;
			var currUsrId = SJP.logged_User;
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
				console.log(data);
				$.each(data.data, function (key, val) {
					ZOHO.CRM.API.getRecord({
						Entity: "SJP_CRM",
						RecordID: val.id,
					}).then(function (data) {
						$.each(data.data, function (key2, val2) {
							console.log(val2);
							$.each(val2.SJP_Subform, function (key3, val3) {
								console.log(val3.Customer_Name.id);
								SJP.Planned_Cus.push(val3.Customer_Name.id);
							});
							if (val2.Areas_Planned != null) {
								var areaPlannedString = val2.Areas_Planned;
								var areaPlannedarray = areaPlannedString.split(",");
								var iterator = areaPlannedarray.values();

								for (let letter of iterator) {
									console.log(letter);
									SJP.Planned_Area.push(letter);
								}
								console.log(SJP.Planned_Area);
							}
						});
					});
				});
			}); //Search Record API callback ends
			console.log(SJP.Planned_Cus);
			customSortSelectAreas = [];
			SJP.is_backendEvent = false;
			//console.log(SJP.customers_exp);
			//$('#Area_Selector').find(':input').val('');
			$("#customer_Selector").html("");
			$("#customer_Selector").selectpicker("refresh");
			$("#Area_Selector").empty();
			console.log("SS:Area Cleared");
			$("#Area_Selector").val([]);
			areasPreSelectedArray = [];
			$("#Area_Selector").val("");
			$(".submit").attr("disabled", false);
			$(".reset").attr("disabled", true);
			$("#selectActivity option:eq(0)")
				.prop("selected", true)
				.trigger("change");
			$("#area_type option:eq(0)").prop("selected", true).trigger("change");
			var selectedDay = date.getDate();
			var selectedDayName = date.getDay();
			var selectedMonth = date.getMonth() + 1;
			selectedYear = date.getFullYear();
			SJP.is_edit = 0;
			$(".customers tbody tr").remove();
			var events_count = $("#count_enents").val();
			if (SJP.is_edit == 0)
				if (SJP.Selected_User != SJP.logged_User) {
					// $('#delete').hide();

					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html(
						"Sorry!! You can't add SJP for this user"
					);
					$("#exampleModalCenter").modal("show");
					return;
				} else {
					if (SJP.status == "Sent") {
						if (selectedMonth == cal.calMonth) {
							$("#exampleModalCenter .modal-title").html("Alert");
							$("#exampleModalCenter .modal-body").html(
								"Sorry!! This SJP cannot be modified."
							);
							$("#exampleModalCenter").modal("show");
							return;
						}
					}
				}
			// if(selectedDayName == 0)
			// {
			//     $('#exampleModalCenter .modal-title').html('Alert');
			//     $('#exampleModalCenter .modal-body').html("Sorry!!Cannot Create SJP on Sunday");
			//     $('#exampleModalCenter').modal('show');
			//     return;
			// }
			if (SJP.userRole == "FLSP") {
				if (SJP.status == "Approved" || SJP.status == "Sent") {
					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html(
						"Sorry!! This SJP cannot be modified."
					);
					$("#exampleModalCenter").modal("show");
					return;
				}
			}
			if (selectedDay.toString().length == 1) {
				selectedDay = "0" + selectedDay;
			}
			if (selectedMonth.toString().length == 1) {
				selectedMonth = "0" + selectedMonth;
			}
			var curr_date = new Date();
			var curr_year = curr_date.getFullYear();
			var curr_month = curr_date.getMonth() + 1;
			var curr_day = curr_date.getDate();
			if (curr_day < 10) {
				curr_day = "0" + curr_day;
			}

			if (curr_month < 10) {
				curr_month = "0" + curr_month;
			}
			var current_date = curr_year + "-" + curr_month + "-" + curr_day;
			var selected_date =
				selectedYear + "-" + selectedMonth + "-" + selectedDay;
			console.log("date test");
			console.log(current_date);
			console.log(selected_date);
			console.log("date test end");
			if (current_date > selected_date) {
				$("#exampleModalCenter .modal-title").html("Alert");
				$("#exampleModalCenter .modal-body").html(
					"Planning for Past Dates not allowed !!"
				);
				$("#exampleModalCenter").modal("show");
			}
			// else {
			//     var events = $('#calendar').fullCalendar('clientEvents');
			//     var current_date_events = '';
			//     for (var i = 0; i < events.length; i++) {
			//         var start_date = new Date(events[i].start);
			//         var end_date = '';
			//         var st_day = start_date.getDate();
			//         var st_monthIndex = start_date.getMonth() + 1;
			//         var st_year = start_date.getFullYear();
			//         var event_date = st_year + '-' + st_monthIndex + '-' + st_day;
			//         if (event_date == selected_date) {
			//             current_date_events = event_date;
			//         }
			//     }
			//     if (current_date_events != "") {
			//         $('#exampleModalCenter .modal-title').html('Alert');
			//         $('#exampleModalCenter .modal-body').html('You already planned !!');
			//         $('#exampleModalCenter').modal('show');
			//     } else {
			//         $('#datetimepicker').val(selectedYear + '-' + selectedMonth + '-' + selectedDay);
			//         $('#userSelectedYear').val(selectedYear);
			//         $("#wrap").hide();
			//         $("#formScreen").show();
			//     }
			// }
			else {
				var events = $("#calendar").fullCalendar("clientEvents");
				var current_date_events = "";
				for (var i = 0; i < events.length; i++) {
					var start_date = new Date(events[i].start);
					var end_date = "";
					var st_day = start_date.getDate();
					var st_monthIndex = start_date.getMonth() + 1;
					var st_year = start_date.getFullYear();
					var st_year = start_date.getFullYear();
					if (st_monthIndex < 10) {
						st_monthIndex = "0" + st_monthIndex;
					}

					if (st_day < 10) {
						st_day = "0" + st_day;
					}
					var event_date = st_year + "-" + st_monthIndex + "-" + st_day;
					if (event_date == selected_date) {
						current_date_events = event_date;
					}
				}
				// if (current_date_events != "") {
				// // $('#exampleModalCenter .modal-title').html('Alert');
				// $('#exampleModalCenter .modal-body').html('You already planned !!');
				// $('#exampleModalCenter').modal('show');
				// } else {
				$("#datetimepicker").val(
					selectedYear + "-" + selectedMonth + "-" + selectedDay
				);
				$("#userSelectedYear").val(selectedYear);
				$("#wrap").hide();
				$("#formScreen").show();
				// }
			}
			//API to gt planned days
			var selectedMonth = $("#calendar").fullCalendar("getDate").getMonth() + 1;
			var selectedYear = $("#calendar").fullCalendar("getDate").getFullYear();
			var monAndYear = selectedMonth + "-" + selectedYear;
			var currentUserId = SJP.logged_User;
			console.log("currentUserId in edit" + currentUserId);
			console.log("monAndYear" + monAndYear);
			console.log("currentUserId" + currentUserId);
			// ZOHO.CRM.API.searchRecord({Entity:'SJP_CRM',Type:'criteria',Query:'((Owner:equals:'+currentUserId+') and (SJP_Month:equals:'+monAndYear+'))'})
			// .then(function(data){
			//     console.log('in insert');
			ZOHO.CRM.API.searchRecord({
				Entity: "SJP_CRM",
				Type: "criteria",
				Query:
					"((Owner:equals:" +
					currentUserId +
					") and (SJP_Month:equals:" +
					monAndYear +
					"))",
			}).then(function (data) {
				console.log("in insert");
				console.log(data.data);
				$("#Area_Selector").empty();
				console.log("SS:Area Cleared");
				$("#Area_Selector").val("");
				$.each(data.data, function (key, val) {
					if (val.Activity_type == "Field Work") {
						$("#day" + val.Day).prop("disabled", true);
						console.log("planned days in select" + val.Day);
					}
				});
			});
		},
		eventClick: function (calEvent, jsEvent, view) {
			$("#customer_Selector").html("");
			$("#customer_Selector").selectpicker("refresh");
			$("#Area_Selector").empty();
			console.log("SS:Area Cleared");
			$("#Area_Selector").val([]);
			areasPreSelectedArray = [];
			$("#Area_Selector").val("");
			$("#selectActivity").prop("disabled", false);
			console.log("Area_Selector 1");
			console.log($("#Area_Selector")[0]);
			$("#Area_Selector").prop("disabled", false); // ! disabled false area, changed - commented
			console.log($("#Area_Selector")[0]);
			$("#customer_Selector").prop("disabled", false);
			customSortSelectAreas = [];
			var current_date = cal.calMonth + "-" + cal.calYear;
			var currUsrId = SJP.logged_User;
			console.log("current_date :" + current_date);
			console.log("currUsrId : " + currUsrId);
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
				// console.log("SJP_CRM Data :"); // * closed all console log for performance
				// console.log(data);
				$.each(data.data, function (key, val) {
					ZOHO.CRM.API.getRecord({
						Entity: "SJP_CRM",
						RecordID: val.id,
					}).then(function (data) {
						// console.log("Index :" + key);
						// console.log("SJP_CRM Record :");
						// console.log(data);
						$.each(data.data, function (key2, val2) {
							// console.log(val2);
							$.each(val2.SJP_Subform, function (key3, val3) {
								// console.log(val3.Customer_Name.id);
								SJP.Planned_Cus.push(val3.Customer_Name.id);
							});
							if (val2.Areas_Planned != null) {
								var areaPlannedString = val2.Areas_Planned;
								var areaPlannedarray = areaPlannedString.split(",");
								var iterator = areaPlannedarray.values();

								for (let letter of iterator) {
									// console.log(letter);
									SJP.Planned_Area.push(letter);
								}
								// console.log(SJP.Planned_Area);
							}
						});
					});
				});
			}); //Search Record API callback ends
			console.log(SJP.Planned_Cus);
			areasPreSelectedArray = [];
			SJP.is_backendEvent = false;
			SJP.is_edit = 1;
			SJP.checkAreaChange = 1;
			calendarEventClickedObj = calEvent;
			var selectedYear = $("#calendar").fullCalendar("getDate").getFullYear();
			$("#userSelectedYear").val(selectedYear);
			var name = calEvent.title;
			var event_id = calEvent.event_id;
			console.log("CAME HERE" + event_id);
			SJP.eventIdForDelete = event_id;
			$("#edit").val("1");
			$(".customers tbody tr").remove();
			ZOHO.CRM.API.getRecord({
				Entity: "SJP_CRM",
				RecordID: event_id,
			}).then(function (data) {
				console.log("all edit dataa");
				console.log(data); // ! area type - check here for area type
				// console.log("data");
				// console.log(data);
				// console.log("data End");
				// console.log('all edit dataa');
				// console.log(data.data[0].SJP_Subform.length);
				// console.log('array of data');
				console.log("###########################################################################");
				if (data.data[0].SJP_Subform.length) {
					purposeForAreaCondition = data.data[0].SJP_Subform[0].Purpose;
					if (
						data.data[0].SJP_Subform[0].Purpose == "Preventive Maintenance" ||
						data.data[0].SJP_Subform[0].Purpose == "Complaints" ||
						data.data[0].SJP_Subform[0].Purpose == "Installation" ||
						data.data[0].SJP_Subform[0].Purpose == "Demo"
					) {
						console.log("inside the backend entered event");
						SJP.is_backendEvent = true;
						SJP.Backendevent_title = data.data[0].BackendTitle;
						if (
							data.data[0].SJP_Subform[0].Purpose == "Preventive Maintenance"
						) {
							console.log(
								"1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
							);
							$("#selectActivity").prop("disabled", true);
							console.log("###########################################################################");
							console.log("Area_Selector 2");
							console.log($("#Area_Selector")[0]);
							$("#Area_Selector").prop("disabled", true); // ! disabled true area
							$("#customer_Selector").prop("disabled", true);
							console.log($("#Area_Selector")[0]);
						}
					}

					// ! conditions for PM, COMP and INS to disable Area field
					if (purposeForAreaCondition && (purposeForAreaCondition == "Preventive Maintenance" || purposeForAreaCondition == "Complaints" || purposeForAreaCondition == "Installation")) {
						// setTimeout(() => {
						// 	console.warn(`PURPOSE inside new if condition ->| ${purposeForAreaCondition}`);
						// })
						$("#Area_Selector").prop("disabled", true).selectpicker('refresh'); // ! disabled true area
						$('[data-id="Area_Selector"]').prop("disabled", true);

						$("#customer_Selector").prop("disabled", true).selectpicker('refresh'); // ! disabled true customers
						$('[data-id="customer_Selector"]').prop("disabled", true);
					} else {
						// setTimeout(() => {
						// 	console.warn(`PURPOSE inside new else condition ->| ${purposeForAreaCondition}`);
						// })
						$("#Area_Selector").prop("disabled", false).selectpicker('refresh'); // ! disabled false area
						$('[data-id="Area_Selector"]').prop("disabled", false).attr('aria-disabled', 'false');

						$("#customer_Selector").prop("disabled", false).selectpicker('refresh'); // ! disabled false customers
						$('[data-id="customer_Selector"]').prop("disabled", false).attr('aria-disabled', 'false');
						// $('[data-id="Area_Selector"]').removeAttr('disabled');
					}
				}
				let rec_full_data_obj = data.data[0];
				let event_name = rec_full_data_obj.Name;
				var get_Customers = data.data[0].SJP_Subform;
				let area_type = data.data[0].Area_Type;
				// if(!area_type){
				// 	fixForAreaType()
				// }
				console.log("area_type option -->| ", area_type,
					$('#area_type option[value="' + area_type + '"]').attr(
						"selected",
						"selected"
					)
				);
				$('#area_type option[value="' + area_type + '"]').attr(
					"selected",
					"selected"
				);
				$(".selectpicker").selectpicker("refresh");
				let areas_to_select_on_edit = [];
				if (get_Customers.length > 0) {
					$.each(get_Customers, function (sub_key, sub_val) {
						let area = sub_val.Area;
						// if (area.length > 0) {
						//     areas_to_select_on_edit.push(area);
						// }
					});
				}
				var get_areas = data.data[0].Areas_Planned;
				if (get_areas != null) var areas_in_array = get_areas.split(",");
				// console.log('get_areas' + areas_in_array);
				var inEditformatedAreas = [];
				let areas_options = "";
				$.each(areas_in_array, function (key, val) {
					console.log("'" + val + "'");
					inEditformatedAreas.push("'" + val + "'");
					areas_options +=
						'<option value="' + val + '" selected>' + val + "</option>";
				});
				var stringAreas = inEditformatedAreas.toString();
				// showAreas(userHQID, areas_to_select_on_edit);
				//Installation Code Start
				//---------------------------VAlign Code---------------------------
				/*if (event_name.indexOf('INS') != -1 || event_name.indexOf('COMP') != -1 || event_name.indexOf('DEM') != -1 || event_name.indexOf('PM') != -1) {
					console.log(areas_options);
					$('#Area_Selector').find('option').remove();
					$('.selectpicker').selectpicker('refresh');
					$('#Area_Selector').append(areas_options);
					$('.selectpicker').selectpicker('refresh');
					if (get_Customers.length > 0) {
						$.each(get_Customers, function(sub_key, sub_val) {
							let area = sub_val.Area;
							if (area.length > 0) {
								$('#Area_Selector option[value="' + area + '"]').prop('selected', 'selected');
							}
						});
						$('.selectpicker').selectpicker('refresh');
					}
				} else {
					console.log("_____________________________________KP")
					showAreas(userHQID, areas_to_select_on_edit);
				}*/
				//---------------------------VAlign Code ends---------------------------
				//Installation Code End

				// console.log(areas_options);
				// console.log(areas_in_array);
				// console.log(inEditformatedAreas);

				console.log("activity type");
				// console.log(data.data[0].Activity_type);
				var areasPreSelected = data.data[0].Areas_Planned;
				console.log(areasPreSelected);
				if (areasPreSelected)
					areasPreSelectedArray = areasPreSelected.split(",");
				$("#selectedEventId").val(data.data[0].id);
				$("#wrap").hide();
				$("#userName").val(data.data[0].Owner.name);
				$("#userHq").val(data.data[0].HQ);
				$(".selectRole").val(data.data[0].Role);
				$("#datetimepicker").val(data.data[0].Date);
				console.log("activityType" + data.data[0].Activity_Type);
				if (data.data[0].Field_work_Type == "With Staff") {
					console.log(data.data[0].Staff_Name.id);
					SJP.with_Staffid = data.data[0].Staff_Name.id;
					SJP.with_Staffname = data.data[0].Staff_Name.name;
				}
				$("#selectActivity").val(data.data[0].Activity_type).trigger("change");
				$("#selectFieldWorkType")
					.val(data.data[0].Field_work_Type)
					.trigger("change");
				$("#userId").val(data.data[0].Owner.id);
				SJP.Approve_Status_onclick_event = data.data[0].Approval_Status;
				//Approve_Status_onclick_event Naresh
				console.log(SJP.logged_User);
				console.log(SJP.Selected_User);
				if (SJP.logged_User != SJP.Selected_User) {
					console.log("one");
					$(".submit").attr("disabled", true);
					$(".reset").attr("disabled", true);
					// $('#delete').hide();
				} else {
					console.log("two");
					if (
						SJP.Approve_Status_onclick_event == "Draft" ||
						SJP.Approve_Status_onclick_event == "Rejected"
					) {
						$(".submit").attr("disabled", false);
						$(".reset").attr("disabled", true);
					}
					if (SJP.Approve_Status_onclick_event == "Sent") {
						console.log("one");
						$(".submit").attr("disabled", true);
						$(".reset").attr("disabled", true);
						// $('#delete').hide();
					} else {
						//  $('#delete').show();
						if (SJP.status == "Approved") {
							console.log("Approved but purpose is NON AMC Follow Up");
							let purposeValue = $(".purpose").val();
							if (purposeValue == "Non AMC Follow Up") {
								$(".submit").attr("disabled", false);
							}
							// $('#delete').hide();
						}
						$(".submit").attr("disabled", false);
						$(".reset").attr("disabled", true);
					}
				}

				//Approve_Status_onclick_event Naresh
				if (SJP.userRole == "FLSE") {
					if (data.data[0].Activity_type == "Field Work") {
						$(".customers").show(); //Abi
						// $('.customers tbody tr').remove();
					} else {
						$(".customers").hide(); //Abi
						$(".customers tbody tr").remove();
					}
				} else {
					if (
						data.data[0].Activity_type == "Field Work" &&
						data.data[0].Fieldwork_Type != "Distributor Visit"
					) {
						$(".customers").show();
						// $('.customers tbody tr').remove();
					} else {
						$(".customers").hide();
						$(".customers tbody tr").remove();
					}
				}
				$("#meetingType").val(data.data[0].Meeting_Type);
				$("#fisp-hq").val(data.data[0].FLSP_HQ);
				var areasPreSelected = data.data[0].Areas_Planned;
				if (areasPreSelected)
					areasPreSelectedArray = areasPreSelected.split(",");
				//$(".selectDay").val(data.data[0].Day).trigger('change');
				console.log("Area_Type -->| ", data.data[0].Area_Type);
				console.log("area for Area_Type -->| ", areasPreSelectedArray);
				console.log("staff hq id for Area_Type -->| ", $("#staffHqId").val());
				console.log("staff name for Area_Type -->| ", $(".staff-name option:selected").attr("data-email"));
				$("#area_type").val(data.data[0].Area_Type); // ! area type - getting set here
				$("#office-type").val(data.data[0].Office_Type);
				$("#marketingType").val(data.data[0].Marketing_Activity_Type);
				var SJP_SubformData = data.data[0].SJP_Subform;
				console.log("SJP_SubformData");
				console.log(SJP_SubformData);
				//---------------------------------------------------------------------------------------------new code                CusFromSubform = [];
				$.each(data.data[0].SJP_Subform, function (key, val) {
					var myStr123 = {
						Account_Name: val.Customer_Name.name,
						id: val.Customer_Name.id,
					};
					//customerPreSelectedArray.push(myStr123);
					CusFromSubform.push(myStr123);
				});
				SJP.MultiCustomers(stringAreas, CusFromSubform);
				//-------------------------------------------------------------------------------------------------------
				console.log("deciding areas is null or not");
				if (get_areas != null) {
					console.log("Areas not NULL");
					SJP.getAllCustomers(SJP_SubformData, stringAreas);
				} else {
					console.log("Areas are null");
					SJP.staffGetAllCustomers(SJP_SubformData);
					console.log(SJP_SubformData);
				}
				//API to gt planned days
				var selectedMonth =
					$("#calendar").fullCalendar("getDate").getMonth() + 1;
				var selectedYear = $("#calendar").fullCalendar("getDate").getFullYear();
				var monAndYear = selectedMonth + "-" + selectedYear;
				var currentUserId = SJP.logged_User;
				console.log("currentUserId in edit" + currentUserId);
				console.log("monAndYear" + monAndYear);
				console.log("currentUserId" + currentUserId);
				ZOHO.CRM.API.searchRecord({
					Entity: "SJP_CRM",
					Type: "criteria",
					Query:
						"((Owner:equals:" +
						currentUserId +
						") and (SJP_Month:equals:" +
						monAndYear +
						"))",
				}).then(function (data) {
					console.log("in event edit");
					console.log(data.data);
					$.each(data.data, function (key, val) {
						if (val.Activity_type == "Field Work") {
							$("#day" + val.Day).prop("disabled", true);
							console.log("planned days in event click" + val.Day);
						}
					});
				});
				//Add here
				var checkUser = data;
				console.log(checkUser);
				console.log("below is activity type");
				console.log("---field work type");
				console.log(data.data[0].Activity_type);
				console.log(data.data[0].Field_work_Type);
				if (data.data[0].Activity_type == "Field Work") {
					if (data.data[0].Field_work_Type != "Distributor Visit") {
						console.log("Get All USers");
						console.log("below is the staff name");
						// console.log(checkUser.data[0].Staff_Name.id);
						var staffRole = $("#userRole").val();
						if (staffRole == "RSM") {
							staffRole = "FLSE";
						}
						if (staffRole == "ZSM") {
							staffRole = "RSM";
						}
						$('#staff-name option[value!=""]').remove();
						var pageNumber = 1;
						var dropdownID = "#staff-name";
						$("#staff-name").empty();
						console.log("staff name calling at 737");
						// getAllRECORDS(pageNumber, dropdownID, checkUser);
						getAllRECORDS(pageNumber, dropdownID, checkUser, "");
						// ZOHO.CRM.API.getAllRecords({ Entity: "Employee_Master", sort_order: "asc", per_page: 200, page: 1 })
						//     //ZOHO.CRM.API.searchRecord({Entity:"Employee_Master",Type:"criteria",Query:'(Role:equals:'+staffRole+')'}) //Final API
						//     .then(function(data) {
						//         console.log('below is data from new API to get all users');
						//         console.log(data)
						//         var moreRecord = data.info.more_records
						//         var allUsers = data.data;
						//         var users = '<option disabled="disabled selected="selected">Select Staff</option>';
						//         console.log('before each for users');
						//         $.each(allUsers, function(key, val) {
						//             console.log(val.Owner.name);
						//             users += "<option value='" + val.Owner.name + "' data-email='" + val.Email + "' ' data-id='" + val.Owner.id + "'>" + val.Owner.name + "</option>";
						//         });
						//         $('#staff-name').empty();
						//         $('#staff-name').append(users);
						//         console.log('after each for users');

						//         if (checkUser.data[0].Staff_Name) {
						//             $("#staff-name option").each(function() {
						//                 console.log(checkUser.data[0].Staff_Name.id);
						//                 console.log($(this).data("id"));
						//                 if ($(this).data("id") == checkUser.data[0].Staff_Name.id)
						//                     $(this).attr("selected", "selected").trigger('change');
						//             });
						//         }
						//         console.log('after condition loop');
						//         if (moreRecord == true) {
						//             ZOHO.CRM.API.getAllRecords({ Entity: "Employee_Master", sort_order: "asc", per_page: 200, page: 2 })
						//                 //ZOHO.CRM.API.searchRecord({Entity:"Employee_Master",Type:"criteria",Query:'(Role:equals:'+staffRole+')'}) //Final API
						//                 .then(function(data) {
						//                     console.log('below is data from new API to get all users');
						//                     console.log(data)
						//                     var moreRecord = data.info.more_records
						//                     var allUsers = data.data;
						//                     var users = '<option disabled="disabled selected="selected">Select Staff</option>';
						//                     console.log('before each for users');
						//                     $.each(allUsers, function(key, val) {
						//                         users += "<option value='" + val.Owner.name + "' data-email='" + val.Email + "' ' data-id='" + val.Owner.id + "'>" + val.Owner.name + "</option>";
						//                     });
						//                     //$('#staff-name').empty();
						//                     $('#staff-name').append(users);
						//                     console.log('after each for users 2');

						//                     if (checkUser.data[0].Staff_Name) {
						//                         $("#staff-name option").each(function() {
						//                             console.log(checkUser.data[0].Staff_Name.id);
						//                             console.log($(this).data("id"));
						//                             if ($(this).data("id") == checkUser.data[0].Staff_Name.id)
						//                                 $(this).attr("selected", "selected").trigger('change');
						//                         });
						//                     }
						//                     console.log('after condition loop');
						//                 });
						//         }
						//         if (moreRecord == false) {
						//             console.log("Get All USers in false")
						//         }
						//         $(function() {
						//             // choose target dropdown
						//             var select = $('#staff-name');
						//             select.html(select.find('option').sort(function(x, y) {
						//                 // to change to descending order switch "<" for ">"
						//                 return $(x).text() > $(y).text() ? 1 : -1;
						//             }));

						//             // select default item after sorting (first item)
						//             // $('select').get(0).selectedIndex = 0;
						//         });

						//     });
						// console.log("Get All USers");
					}
				}
				$("#wrap").hide();
				$("#formScreen").show();
			});
		},
		droppable: true, // this allows things to be dropped onto the calendar !!!
		drop: function (date, allDay) {
			// this function is called when something is dropped
			// retrieve the dropped element's stored Event Object
			var originalEventObject = $(this).data("eventObject");
			// we need to copy it, so that multiple events don't have a reference to the same object
			var copiedEventObject = $.extend({}, originalEventObject);

			// assign it the date that was reported
			copiedEventObject.start = date;
			copiedEventObject.allDay = allDay;

			// render the event on the calendar
			// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			$("#calendar").fullCalendar("renderEvent", copiedEventObject, true);

			// is the "remove after drop" checkbox checked?
			if ($("#drop-remove").is(":checked")) {
				// if so, remove the element from the "Draggable Events" list
				$(this).remove();
			}
		},
	});
	/* Updating  Current Month And Year at Initial Time and On click  of Prev And Next*/
	$(".fc-button-prev").click(function () {
		var Current_Month = $("#calendar").fullCalendar("getDate").getMonth();
		var Current_Year = $("#calendar").fullCalendar("getDate").getFullYear();
		cal.calMonth = Current_Month + 1;
		cal.calYear = Current_Year;
		console.log("On click of prev btn" + cal.calMonth + cal.calYear);
		SJP.setUpCal(SJP.Selected_User);
		// if(SJP.Selected_User != SJP.logged_User && noOfEventsInAMonth == 0)
		// {
		//     sendApprovalUpdate(0, "");
		// }
	});
	$(".fc-button-next").click(function () {
		var Current_Month = $("#calendar").fullCalendar("getDate").getMonth();
		var Current_Year = $("#calendar").fullCalendar("getDate").getFullYear();
		cal.calMonth = Current_Month + 1;
		cal.calYear = Current_Year;
		console.log("On click of next btn" + cal.calMonth + cal.calYear);
		SJP.setUpCal(SJP.Selected_User);
		// if(SJP.Selected_User != SJP.logged_User && noOfEventsInAMonth == 0)
		// {
		//     sendApprovalUpdate(0, "");
		// }
	});
	/* End Updating  Current Month And Year at Initial Time and On click  of Prev And Next*/

	$("#send-approval").hide();
	// $("#delete").hide();
	var events = $("#calendar").fullCalendar("clientEvents");
	var events_count = 0;
	for (var i = 0; i < events.length; i++) {
		var start_date = new Date(events[i].start);
		var st_monthIndex = start_date.getMonth() + 1;
		var st_year = start_date.getFullYear();
		var curr_date = new Date();
		var current_month = curr_date.getMonth() + 1;
		var current_year = curr_date.getFullYear();
		if (current_month == st_monthIndex) {
			events_count++;
		}
	}
	//Custom js
	var userRole = $(".selectRole option:selected").text();
	$(".field-work-day").hide();
	$(".field-work-area").hide();
	$(".field-work-area-type").hide();
	$(".fieldWorkType").hide();
	$(".meeting").hide();
	$(".office").hide();
	$(".fieldWorkType").hide();
	$(".FlspHq").hide();
	$(".staffName").hide();
	$(".marketingTypeContainer").hide();
	$("#selectActivity").change(function () {
		if ($("#edit").val() == 0) {
			$("#selectFieldWorkType").val("Select Field Work Type");
			$("#staff-name").val("Select Staff");
		}
		$(".staffArea").hide();
		userRole = $(".selectRole option:selected").text();
		if ($(this).val() == "Field Work") {
			$(".field-work-day").hide();
			if (userRole == "RSM" || "ZSM" || "BH") {
				$(".field-work").show();
				$(".field-work-area").hide();
				$(".fieldWorkType").show();
				$(".field-work-area-type").show();
				$(".field-work-day").hide();
				$("#selectFieldWorkType option:eq(0)")
					.prop("selected", true)
					.trigger("change");
				$(".customers").hide(); //Abi
				$(".customers tbody tr").remove();
				//showAreas(userHQID);
			}
			if (userRole == "FLSP") {
				$(".field-work").show();
				$(".fieldWorkType").hide();
				$(".field-work-day").show();
				$(".selectDay option:eq(0)").prop("selected", true);
				$(".field-work-area-type").show();
				$(".customers").show(); //Abi
				$(".customers tbody tr").remove();
			}
			if (userRole == "FLSE") {
				console.log("Entered FLSE");
				if (SJP.is_edit == 0) {
					//showAreas(userHQID);
					$(".field-work").show();
					$(".field-work-area").show();
					$(".fieldWorkType").hide();
					$(".field-work-day").hide();
					$(".selectDay option:eq(0)").prop("selected", true);
					$(".field-work-area-type").show();
					$(".customers").show(); //Abi
					$(".customers tbody tr").remove();
				} else {
					$(".field-work").show();
					$(".field-work-area").show();
					$(".fieldWorkType").hide();
					$(".field-work-day").hide();
					$(".selectDay option:eq(0)").prop("selected", true);
					$(".field-work-area-type").show();
					$(".customers").show(); //Abi
					$(".customers tbody tr").remove();
				}
			}
		} else {
			$(".field-work").hide();
			$(".selectDay option:eq(0)").prop("selected", true);
			$(".field-work-area-type select").val("Select Area Type");
			$(".customers").hide(); //Abi
			$(".customers tbody tr").remove();
		}
		//if selectActivity is MEETING
		if ($(this).val() == "Meeting") {
			console.log("Entered");
			$(".meeting").show();
			$(".selectDay option:eq(0)").prop("selected", true);
			$("#meetingType option:eq(0)").prop("selected", true);
			$(".field-work-area-type select").val("Select Area Type");
		} else {
			$(".meeting").hide();
			$(".remarks").hide();
			$("#meetingType").val("");
		}
		//if selectActivity is Office
		if ($(this).val() == "Office") {
			$(".office").show();
			$(".selectDay option:eq(0)").prop("selected", true);
			$("#office-type option:eq(0)").prop("selected", true);
			$(".field-work-area-type select").val("Select Area Type");
		} else {
			$(".office").hide();
			console.log("Office Hidden");
		}
		if ($(this).val() == "Marketing Activity") {
			$(".marketingTypeContainer").show();
			$(".selectDay option:eq(0)").prop("selected", true);
			$("#marketingType option:eq(0)").prop("selected", true);
			$(".field-work-area-type select").val("Select Area Type");
		} else {
			$(".marketingTypeContainer").hide();
			console.log("Marketing Hidden");
		}
		//Display remarks if others is selected in meeting type
		$("#meetingType").change(function () {
			if ($("#selectActivity").val() == "Meeting") {
				if ($(this).val() == "Others") {
					if (SJP.is_edit == 0) {
						$(".remarks textarea").val("");
					}
					$(".remarks").show();
				} else {
					$(".remarks").hide();
				}
			}
		});
	});
	var selectFieldWorkType = $("#selectFieldWorkType option:selected").text();
	if (selectFieldWorkType == "With Staff") {
		$(".FlspHq").show();
		$(".flspHq").val("");
		$(".staffName").show();
		console.log("Area_Selector 3");
		console.log("###########################################################################");

		$("#Area_Selector").prop("disabled", true); // ! disabled true area
		$("#staffAreaSelect").prop("disabled", true);
		$("#customer_Selector").prop("disabled", true);
	}
	if (selectFieldWorkType == "Independent") {
		$(".staffArea").hide();
		$(".field-work-day").hide();
		console.log("Independent Plan");
		console.log("Area_Selector 4");
		console.log("###########################################################################");
		$("#Area_Selector").prop("disabled", false); // ! disabled false area, changed - commented
		$("#staffAreaSelect").prop("disabled", false);
		$("#customer_Selector").prop("disabled", false);
	}
	if (selectFieldWorkType == "Distributor Visit") {
		$(".field-work-day").hide();
		$(".field-work-area-type").hide();
		$(".field-work-area").hide();
	}
	$("#selectFieldWorkType").change(function () {
		console.log("SS:FieldWork Changed");
		$("#Area_Selector").selectpicker("deselectAll");
		$("#staffAreaSelect").selectpicker("deselectAll");
		selectFieldWorkType = $("#selectFieldWorkType option:selected").text();
		if (selectFieldWorkType == "With Staff") {
			$(".FlspHq").show();
			$(".flspHq").val("");
			$(".staffName").show();
			console.log("Area_Selector 5");
			console.log("###########################################################################");

			$("#Area_Selector").prop("disabled", true); // ! disabled true area
			$("#staffAreaSelect").prop("disabled", true);
			$("#customer_Selector").prop("disabled", true);
		} else {
			$(".FlspHq").hide();
			$(".staffName").hide();
			$(".staffArea").hide();
		}
		if (selectFieldWorkType == "Independent") {
			$(".staffArea").hide();
			$(".field-work-day").hide();
			console.log("Area_Selector 6");
			console.log("###########################################################################");
			/* By Vishnu V-Align to disable Area_Selector when role is FLSE STARTS HERE */
			// if($("#userRole").val() != "FLSE"){
			$("#Area_Selector").prop("disabled", false); // ! disable false area, changed - commented
			// }
			/* By Vishnu V-Align to disable Area_Selector when role is FLSE ENDS HERE */

			$("#staffAreaSelect").prop("disabled", false);
			$("#customer_Selector").prop("disabled", false);
		}
		if (selectFieldWorkType == "Distributor Visit") {
			$(".field-work-day").hide();
			$(".field-work-area-type").hide();
			$(".field-work-area").hide();
			$(".customers").hide(); //Abi
			$(".customers tbody tr").remove();
		} else {
			$(".customers").show(); //Abi
			$(".customers tbody tr").remove();
		}
	});
	$(".selectpicker").change(function () {
		var selected = [];
		$(".selectpicker :selected").each(function () {
			selected.push($(this).text());
		});
		selectedArea = selected.toString();
	});
	//
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function checkCookie() {
		var user = getCookie("username");
		if (user != "") {
			alert("Welcome again " + user);
		} else {
			user = prompt("Please enter your name:", "");
			if (user != "" && user != null) {
				setCookie("username", user, 365);
			}
		}
	}
	// Zoho API Calls
	var currentUserEmail = "testemail";
	// $(document).ready(function() {
	ZOHO.embeddedApp.on("PageLoad", function (data) {
		setCookie("access_token", "123", "1");
		var Current_Month = $("#calendar").fullCalendar("getDate").getMonth();
		var Current_Year = $("#calendar").fullCalendar("getDate").getFullYear();
		cal.calMonth = Current_Month + 1;
		cal.calYear = Current_Year;
		//End Get the Current Month And Year
		//to get current user
		ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
			var currentUserName = data.users[0].full_name;
			var currentUserId = data.users[0].id;
			currentUserEmail = data.users[0].email;
			$("#userEmailId").val(currentUserEmail);
			$("#userName").val(currentUserName);
			$("#userId").val(currentUserId);
			SJP.logged_User = currentUserId;
			SJP.currentUserName = currentUserName;
			//API to get HQ / Role
			ZOHO.CRM.API.searchRecord({
				Entity: "Employee_Master",
				Type: "criteria",
				Query: "(Email:equals:" + currentUserEmail + ")",
			}).then(function (data) {
				// console.log('________________________________uday');
				// console.log(data);
				var data = data.data[0];
				var userROle = data.Role;
				userHQID = data.HQ.id;
				// console.log("I am here" + userHQID);
				var hqName = data.HQ.name;
				$("#userHq").val(hqName);
				$("#userHqId").val(userHQID);
				$("#userRole").val(userROle);
				$(".selectRole").val(userROle);
				SJP.userRole = userROle;

				var pageNumber = 1;
				var dropdownID = "#users-list";
				getAllRECORDS(pageNumber, dropdownID, null, "");

				/***********************Abhilash Start***************************/
				//API to get all users
				// ZOHO.CRM.API.getAllRecords({ Entity: "Employee_Master", sort_order: "asc", per_page: 200, page: 1 })
				//     .then(function(data) {
				//         console.log("user-listentry");
				//         console.log(data);
				//         var moreRecord = data.info.more_records
				//         var userId = $('#userId').val();
				//         var userList = '<option>--Select Users--</option>'
				//         $.each(data.data, function(key, val) {
				//                 var selected = (userId == val.Owner.id) ? "selected" : "";
				//                 userList += '<option value=' + val.Owner.id + ' ' + selected + '>' + val.Owner.name + '</option>';
				//                 console.log("user-list");
				//                 // console.log("user-list");
				//                 if (SJP.logged_User == val.Owner.id) {
				//                     // console.log(val.id);
				//                     SJP.Selected_User = val.Owner.id;
				//                     SJP.Selected_UserName = val.Owner.name;

				//                 }
				//                 // console.log(SJP);
				//                 // console.log("user-list end");
				//             })
				//             //$('#users-list').html(userList);
				//         $('#users-list').empty();
				//         $('#users-list').append(userList);
				//         if (moreRecord == true) {
				//             ZOHO.CRM.API.getAllRecords({ Entity: "Employee_Master", sort_order: "asc", per_page: 200, page: 2 })
				//                 .then(function(data) {
				//                     console.log("user-listentry");
				//                     console.log(data);
				//                     var moreRecord = data.info.more_records
				//                     var userId = $('#userId').val();
				//                     var userList = '<option>--Select Users--</option>'
				//                     $.each(data.data, function(key, val) {
				//                         var selected = (userId == val.Owner.id) ? "selected" : "";
				//                         userList += '<option value=' + val.Owner.id + ' ' + selected + '>' + val.Owner.name + '</option>';
				//                         console.log("user-list");
				//                         // console.log("user-list");
				//                         if (SJP.logged_User == val.Owner.id) {
				//                             // console.log(val.id);
				//                             SJP.Selected_User = val.Owner.id;
				//                             SJP.Selected_UserName = val.Owner.name;
				//                         }
				//                         // console.log(SJP);
				//                         // console.log("user-list end");
				//                     })
				//                     $('#users-list').append(userList);
				//                 });
				//         }
				//         $(function() {
				//             // choose target dropdown
				//             var select = $('#users-list');
				//             select.html(select.find('option').sort(function(x, y) {
				//                 // to change to descending order switch "<" for ">"
				//                 return $(x).text() > $(y).text() ? 1 : -1;
				//             }));

				//             // select default item after sorting (first item)
				//             // $('select').get(0).selectedIndex = 0;
				//         });

				//         if ($('#userRole').val() != "FLSP") {
				//             $('#users-list').show();
				//         } else {
				//             $('#users-list').hide();
				//         }
				//     })

				/***********************Abhilash End***************************/
				SJP.setUpCal(SJP.logged_User);
				//Naresh start
				console.log("Days in a month");
				$("#send-approval").click(function () {

					// console.log("Send-approval");
					// workingDaysInMonth(cal.calMonth, cal.calYear);
					// if (SJP.noOfEventsInAMonth >= SJP.noOfWorkingDays) {

					//     console.log("SJP.noOfEventsInAMonth" + SJP.noOfEventsInAMonth);
					//     console.log("SJP.noOfWorkingDays" + SJP.noOfWorkingDays);
					//     var Status = "Sent";
					//     var message = "";
					//     //Removed alert and placed the confirm box Naresh
					//     // $('#exampleModalCenter .modal-title').html('Alert');
					//     // $('#exampleModalCenter .modal-body').html('Processing Data For Approval !!');
					//     // $('#exampleModalCenter').modal('show');
					//    //Removed alert and placed the confirm box Naresh

					//     // sjpConfirmSendForApproval(SJP.logged_User, Status);
					//     // console.log(SJP.currentUserName, SJP.logged_User, Status, message);
					//     //Showing confirmation box Naresh
					//         sjpConfirmSendForApproval();
					//    //Showing confirmation box Naresh
					// } else {
					//     $('#exampleModalCenter .modal-title').html('Alert');
					//     $('#exampleModalCenter .modal-body').html("Please complete SJP for all days before sending for approval");
					//     $('#exampleModalCenter').modal('show');
					// }
					SJP.noOfEventsInAMonth = 0;
					console.log(SJP.is_Deviated);
					console.log("Send-approval");
					console.log(cal.calMonth);
					console.log(cal.calYear);
					/* Vishnu V-Align Validation to check whether events are planned all days of current view STARTS HERE...*/
					var hasNoEventDays = false;
					console.log("cal");
					console.log(cal);
					console.log(calendar);
					var calendar1 = $('#calendar').fullCalendar('getCalendar');
					console.log(calendar1);
					var allEvents1 = calendar1.fullCalendar('clientEvents');
					console.log(allEvents1);
					var view1 = $('#calendar').fullCalendar('getView');
					console.log(view1);
					console.log('Start Date:', view1.start);
					console.log('End Date:', view1.end);
					findDaysWithoutEvents(view1.start, view1.end, allEvents1);
					function findDaysWithoutEvents(startDate, endDateTemp, events) {
						endDate = new Date(endDateTemp);
						endDate.setDate(endDate.getDate() - 1);
						const addDay = (currentDate) => {
							const result = new Date(currentDate);
							result.setDate(result.getDate() + 1);
							return result;
						};
						const formatYmd = (date) => {
							const year = date.getFullYear();
							const month = ('0' + (date.getMonth() + 1)).slice(-2);
							const day = ('0' + date.getDate()).slice(-2);
							return `${year}-${month}-${day}`;
						};
						const start = new Date(startDate.setHours(0, 0, 0, 0));
						const end = new Date(endDate.setHours(0, 0, 0, 0));
						let currentDate = start;
						const missingEvents = [];
						while (currentDate <= end) {
							const currentDateString = formatYmd(currentDate);
							const hasEvent = events.some(event => {
								const eventDate = new Date(event.start).setHours(0, 0, 0, 0);
								return eventDate === currentDate.getTime();
							});
							if (!hasEvent) {
								missingEvents.push(currentDateString);
							}
							currentDate = addDay(currentDate);
						}
						if (missingEvents.length > 0) {
							hasNoEventDays = true;
							console.log("Dates without events:", missingEvents);
						} else {
							console.log("All days within the range have at least one event.");
						}
					}
					/* Vishnu V-Align Validation to check whether events are planned all days of current view ENDS HERE...*/
					workingDaysInMonth(cal.calMonth, cal.calYear);
					var UserId = SJP.logged_User;
					console.log("---CheckEvents---");
					var current_date = cal.calMonth + "-" + cal.calYear;
					var currUsrId = UserId;
					var count = 0;
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
						$.each(data.data, function (key, val) {
							console.log(val);
							var date = new Date(val.Date);
							var checkSunday = date.getDay();
							console.log("initial" + SJP.noOfEventsInAMonth);
							if (checkSunday != 0) {
								SJP.noOfEventsInAMonth = SJP.noOfEventsInAMonth + 1;
							}
							if (checkSunday == 0) {
								SJP.noOfEventsInAMonth = SJP.noOfEventsInAMonth + 1;
							}
							console.log("afterinsert" + SJP.noOfEventsInAMonth);
						});

						/* Commented By Vishnu V-align for Month-Event Validation STARTS HERE*/
						// if (SJP.noOfEventsInAMonth >= SJP.noOfWorkingDays) {
						/* Commented By Vishnu V-align for Month-Event Validation ENDS HERE*/

						/* By Vishnu V-align for Month-Event Validation STARTS HERE*/
						if (hasNoEventDays == false) {
							/* By Vishnu V-align for Month-Event Validation ENDS HERE*/
							console.log(SJP.noOfEventsInAMonth);
							console.log(SJP.noOfWorkingDays);
							//    SJP.checkCustomers(UserId);
							sjpConfirmSendForApproval();
						} else {
							// $('#exampleModalCenter .modal-title').html('Alert');
							$("#exampleModalCenter .modal-body").html(
								"Please complete SJP for all the working days before sending for approval"
							);
							$("#exampleModalCenter").modal("show");
						}

					});
					console.log("---check CheckEvents End---");
				});
				console.log("Days in a month");
				/* added dec 15th starts */
				//API to get unplanned days
				var selectedMonth =
					$("#calendar").fullCalendar("getDate").getMonth() + 1;
				var selectedYear = $("#calendar").fullCalendar("getDate").getFullYear();
				var monAndYear = selectedMonth + "-" + selectedYear;
				console.log("monAndYear" + monAndYear);
				console.log("currentUserId" + currentUserId);
				//API to get planned days
				//ZOHO.CRM.API.searchRecord({Entity:"TP_CRM",Type:"criteria",Query:"((Owner:equals:80796000000108013) and (TP_Month:equals:12-2019))"}) // for arpit
				ZOHO.CRM.API.searchRecord({
					Entity: "SJP_CRM",
					Type: "criteria",
					Query:
						"((Owner:equals:" +
						currentUserId +
						") and (SJP_Month:equals:" +
						monAndYear +
						"))",
				}).then(function (data) {
					//console.log(data.data)
					$.each(data.data, function (key, val) {
						if (val.Activity_type == "Field Work") {
							$("#day" + val.Day).prop("disabled", true);
							console.log("planned day" + val.Day);
						}
					});
				});
				//ZOHO.CRM.API.searchRecord({Entity:"STP_CRM",Type:"criteria",Query:"((Month'"+currentMonth+"':equals:false)and(Owner:equals:'"+currentUserId+"')and(Year:equals:'"+currentYear+"'))"})
				/*ZOHO.CRM.API.searchRecord({Entity:'STP_CRM',Type:'criteria',Query:'((Month'+selectedMonth+':equals:false)and(Owner:equals:'+currentUserId+')and(Year:equals:'+selectedYear+'))'})
							.then(function(data){
								var days = '';
								days = '<option selected="selected" disabled="disabled">Select Day</option>'
								$.each(data.data,function(key,val){
									days += '<option value="'+val.Day+'" data-id="'+val.id+'">'+val.Day+'</option>';
								});
								$('.selectDay').html(days);
							})*/
				/* added dec 15th ends */
			});
		});

		//Perform action on select of Field Work
		$("#selectActivity").change(function () {
			console.log("before or");
			$("#Area_Selector").empty();
			console.log("SS:Area Cleared");
			if ($(this).val() == "Field Work") {
				if ($(".selectRole").val() == "FLSE") {
					console.log("edit valur line 1383 ->>" + SJP.is_edit);
					getFlseIndependentAreas(1);
				} else {
					/*console.log('selected fiels type');
					console.log($('#selectFieldWorkType option:selected').val());
					if($('#selectFieldWorkType').val() == 'Independent')
					{
						getFlseIndependentAreas();
					}*/
				}
			}
		});

		//Select worktype
		$("#selectFieldWorkType").change(function () {
			console.log("SS:FieldWork Changed");
			$("#Area_Selector").selectpicker("deselectAll");
			$("#staffAreaSelect").selectpicker("deselectAll");
			//return;
			console.log("selected fiels type");
			console.log($("#selectFieldWorkType option:selected").val());
			//if(($('#selectFieldWorkType').val() == 'Independent') && ($(".selectRole").val != 'FLSE'))
			if ($("#selectFieldWorkType").val() == "Independent") {
				$("#Area_Selector").empty();
				console.log("SS:Area Cleared");
				console.log($("#Area_Selector > option").length);
				getFlseIndependentAreas(1);
			}
			//API to get all users if the role is RBH or ZBH or BH
			console.log("before role condition");
			/*if (($('#userRole').val() == 'RSM') || ($('#userRole').val() == 'ZSM') || ($('#userRole').val() == 'BH')) {*/
			console.log("after role condition");
			//$('.field-work-area').hide();
			workType = $("#selectFieldWorkType option:selected").val();
			console.log($("#selectFieldWorkType option:selected").val());
			//API to get area if independent
			if (workType == "With Staff") {
				$(".field-work-day").hide();
				$(".field-work-area").hide();
				console.log("Area_Selector 7");
				console.log("###########################################################################");

				$("#Area_Selector").prop("disabled", true); // ! disabled true area
				$("#staffAreaSelect").prop("disabled", true);
				$("#customer_Selector").prop("disabled", true);
				/*ZOHO.CRM.API.getAllUsers({
						Type: "ActiveUsers"
					})
					.then(function(data) {
						//   return;
						var allUsers = data.users;
						var users = '';
						users += '<option selected="selected" disabled="disabled">Select Staff</option>'
						$.each(allUsers, function(key, val) {
							users += "<option value='" + val.full_name + "' data-email='" + val.email + "' ' data-id='" + val.id + "'>" + val.full_name + "</option>";
						});
						$('.staff-name').empty();
						$('.staff-name').append(users);
					})*/
				console.log("Get All USers");
				var staffRole = $("#userRole").val();
				if (staffRole == "RSM") {
					staffRole = "FLSE";
				}
				if (staffRole == "ZSM") {
					staffRole = "RSM";
				}
				$("#staff-name").html("");
				var pageNumber = 1;
				var dropdownID = "#staff-name";
				if (SJP.is_edit == 1) {
					console.log("in edit mode");
					$('#staff-name option[value!=""]').remove();
					console.log("staff name calling at 1230");
					console.log($("#staff-name > option").length);
					console.log(SJP.with_Staffid);
					// === OLD CODE (May 26, 23) === //
					// if (
					// 	$("#staff-name > option").length == 0 &&
					// 	SJP.with_Staffid == null
					// )
					if ($("#staff-name > option").length == 0) {
						getAllRECORDS(pageNumber, dropdownID, null, ""); //this was commented as TP(with Staff) creates the SJP(drafts),now by uncommenting the RBH can edit the other events(meetings,transit and holiday),so he will be changing the plan so it was commented
					}
				} else {
					console.log("staff name calling at 1234");
					getAllRECORDS(pageNumber, dropdownID, null, "");
				}
				// ZOHO.CRM.API.getAllRecords({
				// 	Entity: "Employee_Master",
				// 	sort_order: "asc",
				// 	per_page: 200,
				// 	page: 1,
				// })
				//ZOHO.CRM.API.searchRecord({Entity:"Employee_Master",Type:"criteria",Query:'(Role:equals:'+staffRole+')'}) //Final API
				// 	.then(function (data) {
				// 		console.log(data);
				// 		var allUsers = data.data;
				// 		var moreRecord = data.info.more_records;
				// 		var users =
				// 			'<option disabled selected="selected">Select Staff</option>';
				// 		$.each(allUsers, function (key, val) {
				// 			console.log(val.Owner.name);
				// 			users +=
				// 				"<option value='" +
				// 				val.Owner.name +
				// 				"' data-email='" +
				// 				val.Email +
				// 				"' ' data-id='" +
				// 				val.Owner.id +
				// 				"'>" +
				// 				val.Owner.name +
				// 				"</option>";
				// 		});
				// 		$("#staff-name").empty();
				// 		$("#staff-name").append(users);

				// 		if (moreRecord == true) {
				// 			ZOHO.CRM.API.getAllRecords({
				// 				Entity: "Employee_Master",
				// 				sort_order: "asc",
				// 				per_page: 200,
				// 				page: 2,
				// 			})
				// 				//ZOHO.CRM.API.searchRecord({Entity:"Employee_Master",Type:"criteria",Query:'(Role:equals:'+staffRole+')'}) //Final API
				// 				.then(function (data) {
				// 					console.log(data);
				// 					var allUsers = data.data;
				// 					var moreRecord = data.info.more_records;
				// 					var users =
				// 						'<option disabled selected="selected">Select Staff</option>';
				// 					$.each(allUsers, function (key, val) {
				// 						console.log(val.Owner.name);
				// 						users +=
				// 							"<option value='" +
				// 							val.Owner.name +
				// 							"' data-email='" +
				// 							val.Email +
				// 							"' ' data-id='" +
				// 							val.Owner.id +
				// 							"'>" +
				// 							val.Owner.name +
				// 							"</option>";
				// 					});
				// 					//$('#staff-name').empty();
				// 					$("#staff-name").append(users);
				// 					$(function () {
				// 						// choose target dropdown
				// 						var select = $("#staff-name");
				// 						select.html(
				// 							select.find("option").sort(function (x, y) {
				// 								// to change to descending order switch "<" for ">"
				// 								return $(x).text() > $(y).text() ? 1 : -1;
				// 							})
				// 						);

				// 						// select default item after sorting (first item)
				// 						// $('select').get(0).selectedIndex = 0;
				// 					});
				// 				});
				// 		}
				// 	});
				// console.log("Get All USers");
			}
			if (workType == "Independent") {
				if ($("#edit").val() == 1) {
					$(".field-work-area").show();
				}
				// if ($('#edit').val() == 0) {
				//     $('.selectDay option:eq(0)').prop('selected', true);
				// }
				$(".field-work-day").show();
				// $('.selectDay option:eq(0)').prop('selected', true);
				$(".FlspAndIndependent").show();
				$(".staffArea").hide();
				console.log($("#userRole").val());
				/* By Vishnu V-Align to disable Area_Selector when role is FLSE STARTS HERE */
				// if($("#userRole").val() != "FLSE"){
				console.log("Area_Selector 8");
				console.log("###########################################################################");
				$("#Area_Selector").prop("disabled", false); // ! disable false area, changed - commented THIS
				// }
				/* By Vishnu V-Align to disable Area_Selector when role is FLSE ENDS HERE */
				$("#staffAreaSelect").prop("disabled", false);
				$("#customer_Selector").prop("disabled", false);
			}
			/*}*/
		});

		//API to get FLSP HQ from selected staff
		$(".staff-name").change(function () {
			workType = $("#selectFieldWorkType option:selected").val();
			if (workType != "Distributor Visit") {
				$(".field-work-area-type").show();
			}
			if (workType == "With Staff") {
				$(".field-work-area").hide();
				$(".staffArea").show();
				console.log("Area_Selector 9");
				console.log("###########################################################################");

				$("#Area_Selector").prop("disabled", true); // ! disable true for area
				$("#staffAreaSelect").prop("disabled", true);
				$("#customer_Selector").prop("disabled", true);
			}
			if (workType == "Independent") {
				if ($("#edit").val() == 1) {
					$(".field-work-area").show();
				}
				$(".staffArea").hide();
				console.log("Area_Selector 10");
				console.log("###########################################################################");
				$("#Area_Selector").prop("disabled", false); // ! disabled false area, changed - commented
				$("#staffAreaSelect").prop("disabled", false);
				$("#customer_Selector").prop("disabled", false);
			}
			//$('.field-work-area').hide();
			//API to get area based on staff
			var staffAreasArray = undefined; // ? added this to resolve reference error
			if (workType == "With Staff") {
				var selectedDate = $("#datetimepicker").val();
				var staffId = $(".staff-name option:selected").attr("data-id");
				ZOHO.CRM.API.searchRecord({
					Entity: "SJP_CRM",
					Type: "criteria",
					Query:
						"((Date:equals:" +
						selectedDate +
						")and(Owner:equals:" +
						staffId +
						"))",
				}).then(function (data) {
					//debugger;
					var staffAreas = "";
					console.log(data);
					console.log("value of edit =" + $("#edit").val());
					console.log("areasPreSelectedArray in staff area");
					console.log("field workType" + workType);
					console.log("areas for staff select");
					SJP.with_Staffid = data.data[0].Owner.id;
					SJP.with_Staffname = data.data[0].Owner.name;
					console.log(areasPreSelectedArray);
					console.log(data.status);
					if (SJP.checkAreaChange == 1) {
						console.log(SJP.checkAreaChange);
						console.log("in edit");
						$.each(areasPreSelectedArray, function (key, val) {
							staffAreas += '<option selected="selected" >' + val + "</option>";
						});
						//$('#edit').val(0);
						$("#staffAreaSelect").html(staffAreas);
						$("#staffAreaSelect").selectpicker("refresh");
						// $("#staffAreaSelect").prop("disabled", true);
						SJP.checkAreaChange = 0;
					} else {
						console.log("IN ELSE LOOP");
						console.log(data.status);
						if (data.status) {
							console.log(
								"status from API to get staff areas => " + data.status
							);
							if (data.status == 204) {
								console.log("1 - data.status");
								$("#exampleModalCenter .modal-title").html("Alert");
								$("#exampleModalCenter .modal-body").html(
									"The selected staff does not have field planned for the day"
								);
								$("#exampleModalCenter").modal("show");
								$(".staffArea .selectpicker").val(null);
								$("#staffAreaSelect").prop("disabled", true);
								$("#staffAreaSelect").selectpicker("refresh");
								//$('.submit').prop('disabled', true);
							}
						} else {
							//var data = data.data[0].Areas_Planned; // to check and change
							//______________________________________________Changed this for a bug where the after approval of FLSE SJP other than field work is not showing the alert______START_________________________
							if (data.data[0].Areas_Planned == null) {
								console.log("Areas_Planned null");
								$("#exampleModalCenter .modal-title").html("Alert");
								$("#exampleModalCenter .modal-body").html(
									"The selected staff does not have field planned for the day"
								);
								$("#exampleModalCenter").modal("show");
								$(".staffArea .selectpicker").val(null);
								$("#staffAreaSelect").prop("disabled", true);
								$("#staffAreaSelect").selectpicker("refresh");
								//$('.submit').prop('disabled', true);
							} else {
								//______________________________________________Changed this for a bug where the after approval of FLSE SJP other than field work is not showing the alert______END_________________________
								if (data.data[0].Approval_Status != "Approved") {
									console.log("2 - Approved");
									// $('#exampleModalCenter .modal-title').html('Alert');
									$("#exampleModalCenter .modal-body").html(
										"The selected staff's SJP is not approved for the month"
									);
									$("#exampleModalCenter").modal("show");
									$(".submit").attr("disabled", true);
									staffAreas = "";
								} else {
									console.log("3");
									console.log("----------Customer data population------------");
									console.log(data);
									console.log(data.data.length);
									$(".customers").show();
									$("#DynamicBody").empty();
									if (data.data.length > 0) {
										var testarray = [];
										console.log("A");
										var multiple_events = data.data;
										$.each(multiple_events, function (key, val) {
											console.log("B");
											console.log(val);
											console.log("C");
											var event_id_flse = val.id;
											console.log("Customer form");
											ZOHO.CRM.API.getRecord({
												Entity: "SJP_CRM",
												RecordID: event_id_flse,
											}).then(function (data) {
												console.log("one");

												console.log(data);
												console.log("two");
												// console.log(staffId);
												var get_Customers = data.data[0].SJP_Subform;
												console.log(get_Customers);
												SJP.staffGetAllCustomers(get_Customers);
												// var staff_area = data.data[0].Areas_Planned;
											});
										});
									}
									console.log(
										"----------Customer data population End------------"
									);

									//------------------------------------------------- --------------------
									console.log("Customer Form End");
									$(".submit").attr("disabled", false);
									console.log("SS:Data", data);
									$("#areas").val(data.data[0].Areas_Planned);
									// staffAreasArray = null; // ? no variable defined, "undefined" should be used - commented
									if (data.data[0].Areas_Planned)
										staffAreasArray = data.data[0].Areas_Planned.split(",");
									staffAreas += "";
									$.each(staffAreasArray, function (key, val) {
										staffAreas +=
											'<option selected="selected" >' + val + "</option>";
										console.log(staffAreas);
									});
									console.log("SS:StaffAreas inserted");
									var newSSAreas = "";
									$("#staffAreaSelect").attr("disabled", true);
									// $("#staffAreaSelect").html(staffAreas);
									console.log("SS:Arrays", staffAreasArray, SSOtherAreas);
									$.each(
										SSOtherAreas == null ? staffAreasArray : SSOtherAreas,
										function (key, val) {
											if (staffAreasArray.includes(val)) {
												newSSAreas += "<option selected>" + val + "</option>";
											} else {
												newSSAreas += "<option>" + val + "</option>";
											}
										}
									);
									$("#staffAreaSelect").empty();
									$("#staffAreaSelect").append(newSSAreas);
									$("#staffAreaSelect").selectpicker("refresh");
									//$('.submit').prop('disabled', false);
								}
								// console.log(data);
								// $('#areas').val(data);
								// var staffAreasArray = [];
								// if (data)
								//     staffAreasArray = data.split(',');
								// let staffArea = '';
								// $.each(staffAreasArray, function(key, val) {
								//     staffAreas += '<option selected="selected" >' + val + '</option>';
								// });
								// $('#staffAreaSelect').attr('disabled', false);
								// $('#staffAreaSelect').html(staffAreas);
								// $('#staffAreaSelect').selectpicker('refresh');
								// //$('.submit').prop('disabled', false);
							} //for else loop added the change
							//______________________________________________Changed this for a bug where the after approval of FLSE SJP other than field work is not showing the alert______END_________________________
						}
					}
					// $('#staffAreaSelect').remove('option');
					// $('#staffAreaSelect').html(staffAreas);
				});
			}
			/*var data = data.data[0].Areas;
			$('#areas').val(data);

			var staffAreasArray = null;
			if(data)
				staffAreasArray = data.split(',');
			var staffAreas = '';
			$.each(staffAreasArray, function(key, val) {
				staffAreas += '<option selected="selected" >' + val + '</option>';
			});
			$('#staffAreaSelect').html(staffAreas);*/

			//API to get area type
			var selected = [];
			$("#Area_Selector :selected").each(function () {
				selected.push("'" + $(this).text() + "'");
			});
			selectedArea = selected.toString();
			var staffEmail = $(".staff-name option:selected").attr("data-email");
			ZOHO.CRM.API.searchRecord({
				Entity: "Employee_Master",
				Type: "criteria",
				Query: "(Email:equals:" + staffEmail + ")",
			}).then(function (data) {
				console.log("data after staff email");
				console.log(data);
				var userROle = data.data;
				$(".flspHq").val(userROle[0].HQ.name);
				$(".flspHqId").val(userROle[0].HQ.id);
				//API to get area type
				var staffAreaSelected = [];
				$("#staffAreaSelect :selected").each(function () {
					staffAreaSelected.push("'" + $(this).text() + "'");
				});
				selectedArea = staffAreaSelected.toString();
				$("#staffHqId").val(userROle[0].HQ.id);
				var userHQID = userROle[0].HQ.id;
				if (staffAreasArray) { // ! area type - put condition for undefined
					getAllAreas(userHQID, staffAreasArray, [], 1);
				}
				/*var config = {
								   "select_query": "select Name from Area_Type_Master where Name  not in (" + selectedArea + ") and (HQ = '" + userHQID + "')"
								  }
					ZOHO.CRM.API.coql(config).then(function(data)
					{
					})*/

				//API to get area type
				var selected = [];
				$("#staffAreaSelect option:selected").each(function () {
					selected.push("'" + $(this).text() + "'");
					//                        selected.push($(this).text());
					console.log("line 17777 -- " + $(this).text());
				});
				selectedArea = selected.toString();

				var config = {
					select_query:
						"select Area_Type from Area_Type_Master where Name in (" +
						selectedArea +
						") and HQ = '" +
						userROle[0].HQ.id +
						"'",
				};
				console.log(config);
				ZOHO.CRM.API.coql(config).then(function (data) {
					console.log("Area_Type coql data -->| ", data);
					// var data = data.data[0].Areas_Planned; // to check and change
					// if (data.statusText == undefined) {
					//     $('.field-work-area-type select').val('OS');
					// } else {
					var areaType = data.data;
					var areaTypeDp = [];
					$.each(areaType, function (key, val) {
						if (val.Area_Type == "EX HQ") {
							areaTypeDp.push("EX-HQ");
						} else {
							areaTypeDp.push(val.Area_Type);
						}
					});
					if ($.inArray("OS", areaTypeDp) !== -1) {
						$(".field-work-area-type select").val("OS");
					} else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
						$(".field-work-area-type select").val("EX-HQ");
					} else {
						$(".field-work-area-type select").val("HQ");
					}

					// }
				});
			}).catch((error) => { // ! area type - added for debugging
				console.log("Employee_Master email criteria -->| ", error)
			})
			//----Staff area ends
		});

		// //----------------------------Auto Loading the customers after adding areas--START---------------------------------
		// $('.FlspAndIndependent .selectpicker').on('hide.bs.select', function() {
		//     if ($('#userRole').val() != 'RSM') {
		//         var selectedAreas = $('.FlspAndIndependent .selectpicker').val();
		//         //console.log("three");
		//     } else {
		//         if ($('#selectedFieldWorkType').val() == 'Independent') {
		//             var selectedAreas = $('.FlspAndIndependent .selectpicker').val();
		//         } else {
		//             var selectedAreas = $('.selectpicker').val();
		//         }
		//     }
		//     //console.log(selectedAreas);
		//     if (selectedAreas) {
		//         //console.log('two');
		//         var selectedAreas = $('.FlspAndIndependent .selectpicker').val();
		//         //console.log(selectedAreas);
		//         if (selectedAreas) {
		//             //console.log('Areas present');
		//             if (selectedAreas.length > 0) {
		//                 //console.log('Areas no. present');

		//                 //console.log(selectedAreas);

		//                 var areas = selectedAreas;
		//                 var formatedAreas = [];
		//                 $.each(areas, function(key, val) {

		//                     //console.log("'" + val + "'");

		//                     formatedAreas.push("'" + val + "'");

		//                 });
		//                 //console.log(areas);
		//                 var stringAreas = formatedAreas.toString();
		//                 SJP.getCustomers(stringAreas);
		//             } else {
		//                 $('#exampleModalCenter .modal-title').html('Alert');
		//                 $('#exampleModalCenter .modal-body').html('Please select Area..');
		//                 $('#exampleModalCenter').modal('show');
		//             }

		//         } else {
		//             $('#exampleModalCenter .modal-title').html('Alert');
		//             $('#exampleModalCenter .modal-body').html('Please select Area..');
		//             $('#exampleModalCenter').modal('show');
		//         }
		//     }
		//     areaCounter++;
		//     productCounter++;
		// });

		// //----------------------------Auto Loading the customers after adding areas--END---------------------------------

		//API to get area type on document click
		$(".staffArea .selectpicker").on("hide.bs.select", function () {
			console.log("SS:Enter Auto Loading of Customers");
			if (SJP.is_edit == 1 && SJP.Approve_Status_onclick_event == "Approved") {
				console.log("Deviation_Reason");
				if (SJP.is_areaChanged != $(".staffArea .selectpicker").val()) {
					$(".deviation").show();
				}
			} else {
				$(".deviation").hide();
			}
			if ($("#userRole").val() != "RBH") {
				console.log("role is not rbh");
				var AutoselectedAreas = $(".staffArea .selectpicker").val();
			} else {
				if (
					$("#selectFieldWorkType").val() == "Independent" ||
					$("#selectFieldWorkType").val() == "Distributor Visit"
				) {
					console.log($("#selectFieldWorkType").val());
					console.log("A");
					CusFromSubform = [];
					var AutoselectedAreas = $(".staffArea .selectpicker").val();
				} else {
					console.log($("#selectFieldWorkType").val());
					console.log("B");
					var AutoselectedAreas = $(" .selectpicker").val();
				}
				console.log("role is rbh");
				console.log("AutoselectedAreas");
				console.log(AutoselectedAreas);
			}
			// $("#addCustomer").css("pointer-events", "none");
			console.log("after role condition SJP MAIN");
			if (AutoselectedAreas) {
				if (AutoselectedAreas) {
					if (AutoselectedAreas.length > 0) {
						console.log(AutoselectedAreas.length);
						console.log(AutoselectedAreas);
						var areas = AutoselectedAreas;
						var formatedAreas = [];
						$.each(areas, function (key, val) {
							formatedAreas.push("'" + val + "'");
						});
						var stringAreas = formatedAreas.toString();
						console.log("Auto Reloading", CusFromSubform);
						console.log("Auto Reloading", stringAreas);
						SJP.MultiCustomers(stringAreas, CusFromSubform);
					} else {
						console.log("Auto Reloading: Clear", stringAreas);
						// $('#exampleModalCenter .modal-title').html('Alert');
						$("#customer_Selector").empty([]);
						$("#exampleModalCenter .modal-body").html(
							"No Customers Found For The Selected Areas."
						);
						$("#exampleModalCenter").modal("show");
					}
				} else {
					// $('#exampleModalCenter .modal-title').html('Alert');
					$("#exampleModalCenter .modal-body").html(
						"No Customers Found For The Selected Areas."
					);
					$("#exampleModalCenter").modal("show");
				}
			}
			var userHqId = $("#userHqId").val();
			var staffHqId = $("#staffHqId").val();
			var selected = [];
			$("#staffAreaSelect :selected").each(function () {
				selected.push("'" + $(this).text() + "'");
			});
			selectedArea = selected.toString();
			console.log("selectedArea bfr");
			console.log(selectedArea);
			if (selectedArea) {
				var config = {
					select_query:
						"select Area_Type from Area_Type_Master where Name in (" +
						selectedArea +
						") and HQ = '" +
						staffHqId +
						"'",
				};
				console.log(config);
				ZOHO.CRM.API.coql(config).then(function (data) {
					console.log("coqlActivityType inner1");
					console.log(data);
					if (data.statusText == "nocontent") {
						$(".field-work-area-type select").val("OS");
					} else {
						var areaType = data.data;
						var areaTypeDp = [];
						$.each(areaType, function (key, val) {
							if (val.Area_Type == "EX HQ") {
								areaTypeDp.push("EX-HQ");
							} else {
								areaTypeDp.push(val.Area_Type);
							}
						});
						if ($.inArray("OS", areaTypeDp) !== -1) {
							$(".field-work-area-type select").val("OS");
						} else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
							$(".field-work-area-type select").val("EX-HQ");
						} else {
							$(".field-work-area-type select").val("HQ");
						}
					}
				});
			}
		});

		//Api to get area
		var selectedDay = "";
		$(".selectDay").change(function () {
			var selectRole = $(".selectRole").val();
			if (
				$("#selectFieldWorkType option:selected").val() != "Distributor Visit"
			) {
				$(".field-work-area").show();
			}
			selectedDay = $(".selectDay option:selected").text();
			var userHqId = $("#userHqId").val();
			var currUsrId = $("#userId").val();
			var userSelectedYear = $("#userSelectedYear").val();
			ZOHO.CRM.API.searchRecord({
				Entity: "STP_CRM",
				Type: "criteria",
				Query:
					"((Year:equals:" +
					userSelectedYear +
					")and(Owner:equals:" +
					currUsrId +
					")and(Day:equals:" +
					selectedDay +
					"))",
			}).then(function (data) {
				console.log("areas on select of day");
				console.log(data);
				var selectedAreas = "";
				if (SJP.checkAreaChange == 1) {
					if ($("#userRole").val() == "FLSE") {
						console.log("FLSE role");
						$.each(areasPreSelectedArray, function (key, val) {
							selectedAreas +=
								'<option selected="selected" >' + val + "</option>";
						});
						SJP.checkAreaChange = 0;
					}
					if (
						$("#selectFieldWorkType option:selected").val() == "Independent"
					) {
						$.each(areasPreSelectedArray, function (key, val) {
							selectedAreas +=
								'<option selected="selected" >' + val + "</option>";
							console.log(selectedAreas);
						});
						SJP.checkAreaChange == 0;
						console.log(
							"_____________________________________________________________KP 1206"
						);
					}
				} else {
					var areas = data.data[0].Areas_Planned;
					$("#areas").val(areas);
					var areasArray = areas.split(",");
					$.each(areasArray, function (key, val) {
						selectedAreas +=
							'<option selected="selected" >' + val + "</option>";
					});
				}

				$("select#Area_Selector").empty();
				console.log("SS:Area Cleared");
				$("select#Area_Selector").html(selectedAreas);
				$(".selectpicker").selectpicker("refresh");
				//API COQL to get other areas
				var selected = [];
				$("#Area_Selector :selected").each(function () {
					//alert('.areaSelector selected');
					selected.push("'" + $(this).text() + "'");
				});
				selectedArea = selected.toString();
				/*ZOHO.CRM.API.getAllRecords({
						Entity: "Area",
						sort_order: "asc",
						per_page: 100,
						page: 1
					}).then(function(data) {*/
				getAllAreas(userHqId, selectedArea, [], 1);
				// ZOHO.CRM.API.searchRecord({
				// 	Entity: "Area_Type_Master",
				// 	Type: "criteria",
				// 	Query: "(HQ:equals:" + userHqId + ")",
				// }).then(function (data) {
				// 	console.log(data);
				// 	console.log("to get other areas in FLSP and INdependent");
				// 	console.log(data);
				// 	var otherAreas = "";
				// 	// $.each(data.data, function(key, val) {
				// 	//     otherAreas += '<option>' + val.Name + '</option>';
				// 	// });
				// 	//-----------------------------Customer Population Alphabetical Order START--------------------------------
				// 	var x = 0;
				// 	console.log(data.data[0].Name);
				// 	var myAreaArr = [];
				// 	$.each(data.data, function (key, val) {
				// 		var AreaNameStr = data.data[x].Name;
				// 		//myAreaArr.push(AreaNameStr);
				// 		console.log(myAreaArr);
				// 		if (!selectedArea.includes(val.Name)) {
				// 			console.log(val.Name);
				// 			// otherAreas += '<option>' + val.Name + '</option>';
				// 			myAreaArr.push(AreaNameStr);
				// 		}
				// 		x = x + 1;
				// 	});

				// 	console.log(myAreaArr);
				// 	var mySortedAreaArr = myAreaArr.sort();

				// 	$.each(mySortedAreaArr, function (key, val) {
				// 		otherAreas += "<option>" + val + "</option>";
				// 		console.log("AreaNameEach" + val);
				// 	});
				// 	//-----------------------------Customer Population Alphabetical Order END--------------------------------
				// 	$("select.areaSelector").append(otherAreas);
				// 	$(".selectpicker").selectpicker("refresh");
				// });
				/*})*/
				//API to get area type
				if (SJP.is_edit == 1) {
					console.log("LINE 1857");
				} else {
					var selected = [];
					$("#Area_Selector :selected").each(function () {
						selected.push("'" + $(this).text() + "'");
					});
					selectedArea = selected.toString();
					var config = {
						select_query:
							"select Area_Type from Area_Type_Master where Name in (" +
							selectedArea +
							") and HQ = '" +
							userHqId +
							"'",
					};
					ZOHO.CRM.API.coql(config).then(function (data) {
						console.log(data);
						var areaType = data.data;
						var areaTypeDp = [];
						console.log("data of area type");
						console.log(data);
						// if (data.statusText == "nocontent") {
						//     console.log('in data.details.statusMessage');
						//     $('.field-work-area-type select').val('OS');
						// } else {
						//     $.each(areaType, function(key, val) {
						//         if (val.Area_Type == 'EX HQ') {
						//             areaTypeDp.push('EX-HQ');
						//         } else {
						//             areaTypeDp.push(val.Area_Type);
						//         }
						//     });
						//     if ($.inArray("OS", areaTypeDp) !== -1) {
						//         $('.field-work-area-type select').val('OS');
						//     } else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
						//         $('.field-work-area-type select').val('EX-HQ');
						//     } else {
						//         $('.field-work-area-type select').val('HQ');
						//     }
						// }
						//-------------------------new code here with area type is null handling-------------------START------------------
						if (data.statusText == "nocontent") {
							console.log("in data.details.statusMessage");
							$(".field-work-area-type select").val("Select Area Type");
							if ($("#selectActivity").val() == "Field Work") {
								if ($(".selectRole").val() == "FLSP") {
									$("#exampleModalCenter .modal-title").html("Alert");
									$("#exampleModalCenter .modal-body").html(
										"The selected area does not have area type"
									);
									$("#exampleModalCenter").modal("show");
								} else {
									if ($("#selectFieldWorkType").val() == "Independent") {
										$("#exampleModalCenter .modal-title").html("Alert");
										$("#exampleModalCenter .modal-body").html(
											"The selected area does not have area type"
										);
										$("#exampleModalCenter").modal("show");
									}
								}
							}
						} else {
							/*if($('#area_type').val() != 'OS')
								{*/
							var countOfAreaType = data.info.count;
							console.log("countOfAreaType" + countOfAreaType);
							if (selectedAreaLength > countOfAreaType) {
								$("#exampleModalCenter .modal-title").html("Alert");
								$("#exampleModalCenter .modal-body").html(
									"One of the selected area does not have area type"
								);
								$("#exampleModalCenter").modal("show");
							}
							$.each(areaType, function (key, val) {
								if (val.Area_Type == "EX HQ") {
									areaTypeDp.push("EX-HQ");
								} else {
									areaTypeDp.push(val.Area_Type);
								}
							});
							if ($.inArray("OS", areaTypeDp) !== -1) {
								$(".field-work-area-type select").val("OS");
							} else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
								$(".field-work-area-type select").val("EX-HQ");
							} else {
								$(".field-work-area-type select").val("HQ");
							}
							/*}*/
						}
						//-------------------------new code here with area type is null handling-------------------END--------------------
					});
				}
				//API to get area type on changed
			});
		});

		//----------------------------Auto Loading the customers after adding areas--START---------------------------------
		$(".FlspAndIndependent .selectpicker").on("hide.bs.select", function () {
			if ($("#userRole").val() != "RSM") {
				console.log("role is not rsm");
				var AutoselectedAreas = $(".FlspAndIndependent .selectpicker").val();
			} else {
				if ($("#selectFieldWorkType").val() == "Independent") {
					var AutoselectedAreas = $(".FlspAndIndependent .selectpicker").val();
				} else {
					var AutoselectedAreas = $(".selectpicker").val();
				}
				console.log("role is rbh");
				console.log("AutoselectedAreas");
				console.log(AutoselectedAreas);
			}
			// $("#addCustomer").css("pointer-events", "none");
			console.log("after role condition SJP MAIN");
			if (AutoselectedAreas) {
				if (AutoselectedAreas) {
					if (AutoselectedAreas.length > 0) {
						console.log(AutoselectedAreas.length);
						console.log(AutoselectedAreas);
						var areas = AutoselectedAreas;
						var formatedAreas = [];
						$.each(areas, function (key, val) {
							formatedAreas.push("'" + val + "'");
						});
						var stringAreas = formatedAreas.toString();
						SJP.MultiCustomers(stringAreas, CusFromSubform);
					} else {
						// $('#exampleModalCenter .modal-title').html('Alert');
						$("#exampleModalCenter .modal-body").html(
							"No Customers Found For The Selected Areas."
						);
						$("#exampleModalCenter").modal("show");
					}
				} else {
					// $('#exampleModalCenter .modal-title').html('Alert');
					$("#exampleModalCenter .modal-body").html(
						"No Customers Found For The Selected Areas."
					);
					$("#exampleModalCenter").modal("show");
				}
			}
			//areaCounter++;
		});
		//----------------------------Auto Loading the customers after adding areas--END---------------------------------

		//--------------------------------------------------------------------------------------------------------------------
		$(".selectedcustomers .selectpicker").on("hide.bs.select", function () {
			console.log("customer_Selector -->| ", $("#customer_Selector").val());
			var stringCustomers = $("#customer_Selector").val();
			console.log("stringCustomers -->| ", stringCustomers);
			SJP.SelectedCustomers(stringCustomers);
		});
		//--------------------------------------------------------------------------------------------------------------------

		//API to get area type on document click
		$(".FlspAndIndependent .selectpicker").on("hide.bs.select", function () {
			var selected = [];
			var userHqId = $("#userHqId").val();
			$("#Area_Selector :selected").each(function () {
				selected.push("'" + $(this).text() + "'");
			});
			console.log(selected);
			//var MyStr = selected.toString();
			//selectedArea = MyStr.replace(/,/gi, "','");
			//selectedArea = MyStr.replace(",", "','");
			selectedArea = selected.toString();
			console.log("selectedArea");
			console.log(selectedArea);
			if (selectedArea) {
				var config = {
					select_query:
						"select Area_Type from Area_Type_Master where Name in (" +
						selectedArea +
						") and HQ = '" +
						userHqId +
						"'",
					//"select_query": "select Area_Type from Area_Type_Master where Name in ('Anchel petty','Purapuzha') and HQ = '" + userHqId + "'"
				};
				console.log(config);
				//  var apivariable = "select Area_Type from Area_Type_Master where HQ = '" + userHqId + "' and Name in ('" + selectedArea + "')";
				// console.log("Printing API Query for area:"+apivariable);
				console.log(
					"select Area_Type from Area_Type_Master where Name in (" +
					selectedArea +
					") and HQ = '" +
					userHqId +
					"'"
				);
				ZOHO.CRM.API.coql(config).then(function (data) {
					console.log("coqlActivityType inner3");
					console.log(data);
					console.log("area type from response");
					console.log(data);
					if (data.statusText == "nocontent") {
						$(".field-work-area-type select").val("OS");
					} else {
						var areaType = data.data;
						var areaTypeDp = [];
						$.each(areaType, function (key, val) {
							if (val.Area_Type == "EX HQ") {
								areaTypeDp.push("EX-HQ");
							} else {
								areaTypeDp.push(val.Area_Type);
							}
						});
						// ! area type getting selected
						console.log("areaTypeDp if else cond 2490 -->| ", areaTypeDp);
						if ($.inArray("OS", areaTypeDp) !== -1) {
							$(".field-work-area-type select").val("OS");
						} else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
							$(".field-work-area-type select").val("EX-HQ");
						} else {
							$(".field-work-area-type select").val("HQ");
						}
					}
				});
			}
		});

		$("#calendar").fullCalendar("next|prev");
		$("#check").click(function (e) {
			e.preventDefault();
			var Marketing_Activity_Type = $("#marketingType option:selected").val();
			$("#checking").append(Marketing_Activity_Type);
		});

		$(".submit").click(function (e) {
			e.preventDefault();
			//debugger;
			var Remarks = "";
			var Area_Type = "";
			var Areas = "";
			var Activity_Type = $("#selectActivity option:selected").val();
			var datetime = $("#datetimepicker").val();
			var Day = $(".selectDay").val();
			var HQ = $("#userHq").val();
			var Role = $(".selectRole").val();
			var Staff_Name = $("#staff-name option:selected").text();
			var Fieldwork_Type = $("#selectFieldWorkType option:selected").text();
			if (Activity_Type == "Select Activity") {
				$("#exampleModalCenter .modal-title").html("Alert");
				$("#exampleModalCenter .modal-body").html(
					"Please select valid Activity Type"
				);
				$("#exampleModalCenter").modal("show");
				e.preventDefault();
				return;
			}
			var Marketing_Activity_Type = $("#marketingType option:selected").val();
			if (Activity_Type == "Marketing Activity") {
				if (
					Marketing_Activity_Type == null ||
					Marketing_Activity_Type == undefined ||
					Marketing_Activity_Type == "Select Marketing Type"
				) {
					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html(
						"Please select valid marketing activity type"
					);
					$("#exampleModalCenter").modal("show");
					e.preventDefault();
					return;
				}
			}
			if (Activity_Type != "Marketing Activity") {
				Marketing_Activity_Type = "";
			}
			if (Activity_Type == "Field Work") {
				// if (Role == 'FLSE') {
				//     var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
				//     Areas = selectedAreas.join(",");
				//     Day = $('.selectDay option:selected').text();
				//     console.log('Day in FLSP' + Day);
				// }
				//-----------------------------------------------------------------------------------------------
				if (Role == "FLSE") {
					var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
					Areas = selectedAreas.join(",");
					//Day = $('.selectDay option:selected').text();
					//console.log('Day in FLSP'+Day);
				}
				//-------------------------------------------------------------------------------------------------
				else {
					if (Fieldwork_Type == "Select Field Work Type") {
						$("#exampleModalCenter .modal-title").html("Alert");
						$("#exampleModalCenter .modal-body").html(
							"Please select valid field work type"
						);
						$("#exampleModalCenter").modal("show");
						e.preventDefault();
						return;
					}
					if (Fieldwork_Type == "With Staff") {
						if (Staff_Name == "Select Staff") {
							$("#exampleModalCenter .modal-title").html("Alert");
							$("#exampleModalCenter .modal-body").html("Please select staff");
							$("#exampleModalCenter").modal("show");
							e.preventDefault();
							return;
						}
					}
					console.log("day val bfr");
					console.log($(".selectDay").val());
					if (Fieldwork_Type == "Independent") {
						console.log("Fieldwork_Type is Independent");
						Staff_Name = null;
						console.log(Staff_Name);
						var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
						Areas = selectedAreas.join(",");
						Day = $(".selectDay option:selected").text();
						console.log("Day in Independent" + Day);
						// if (Day == 'Select Day') {
						//     $('#exampleModalCenter .modal-title').html('Alert');
						//     $('#exampleModalCenter .modal-body').html("Please select Day");
						//     $('#exampleModalCenter').modal('show');
						//     e.preventDefault();
						//     return;
						// }
					} else {
						var selectedAreas = $("#staffAreaSelect").val();
						Areas = selectedAreas.join(",");
					}
				}
				if (Fieldwork_Type == "Distributor Visit") {
					Area_Type = "";
					Areas = "";
					Day = "";
				} else {
					Area_Type = $("#area_type").val();
				}
				// if (Role != 'FLSE') {
				//     if (Day == 'Select Day') {
				//         $('#exampleModalCenter .modal-title').html('Alert');
				//         $('#exampleModalCenter .modal-body').html("Please select Day");
				//         $('#exampleModalCenter').modal('show');
				//         e.preventDefault();
				//         return;
				//     }
				// }
				//Return if no areas for selected user
				if (Fieldwork_Type == "Independent" || Fieldwork_Type == "With Staff") {
					if (Areas == null || Areas == "") {
						$("#exampleModalCenter .modal-title").html("Alert");
						$("#exampleModalCenter .modal-body").html(
							"The selected staff does not have field planned for the day"
						);
						$("#exampleModalCenter").modal("show");
						e.preventDefault();
						return;
					}
				}
			} else {
				Field_work_Type = "";
			}
			var Name = "";
			var AreaLength = Areas.length;
			console.log(AreaLength + "____________________________________" + Areas);
			if (Areas != null && SJP.is_backendEvent == false) {
				if (AreaLength >= 50) {
					var res = Areas.substr(0, 50);
					Name = Activity_Type + "" + res;
				} else {
					Name = Activity_Type + "" + Areas;
				}
				// console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
				// Name = Activity_Type + ' - ' + Areas;
			}
			if (Areas != null && SJP.is_backendEvent == true) {
				console.log("BBBBBBBBBBBBBBBBBBBBBBBB");
				Name = SJP.Backendevent_title;
			}
			var userName = $(".userName").val();
			var Fieldwork_Type = $("#selectFieldWorkType option:selected").text();
			var FLSP_HQ = $("#fisp-hq").val();
			var Office_Type = $("#office-type").val();
			if (Activity_Type == "Office") {
				if (
					Office_Type == null ||
					Office_Type == undefined ||
					Office_Type == "Select Office Type"
				) {
					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html(
						"Please select valid office type"
					);
					$("#exampleModalCenter").modal("show");
					e.preventDefault();
					return;
				}
			}
			var Staff_Id = $(".staff-name option:selected").attr("data-id");
			var MeetingType = $("#meetingType").val();
			if (Activity_Type == "Meeting") {
				if (
					MeetingType == null ||
					MeetingType == undefined ||
					MeetingType == "Select Meeting Type"
				) {
					$("#exampleModalCenter .modal-title").html("Alert");
					$("#exampleModalCenter .modal-body").html(
						"Please select valid meeting type"
					);
					$("#exampleModalCenter").modal("show");
					e.preventDefault();
					return;
				}
				if ($("#meetingType").val() == "Others") {
					Remarks = $(".remarks textarea").val();
					if (Remarks == "" || Remarks == null) {
						$("#exampleModalCenter .modal-body").html("Please Submit remarks");
						$("#exampleModalCenter").modal("show");
						e.preventDefault();
						return;
					}
				}
			}
			if (!Staff_Name || !Staff_Id) Staff_Name = null;
			else {
				Staff_Name = {
					name: Staff_Name,
					id: Staff_Id,
				};
			}
			var userId = $("#userId").val();
			e.preventDefault();
			//Inset SJP
			//SJP Check
			console.log(SJP.is_edit);
			if (SJP.is_edit == 0) {
				console.log("SJP INSERT --------------------------------");
				var customers = [];
				$(".customers tbody tr").each(function () {
					var Customer_details = {};
					var customer_id = $(this).find('[name="customer"]').val();
					var customer_name = $(this)
						.find('[name="customer"] option:selected')
						.text();
					var product_id = $(this).find('[name="product"]').val();
					var product_name = $(this)
						.find('[name="product"] option:selected')
						.text();
					var customer_purpose = $(this).find('[name="purpose"]').val();
					var ProductName = $(this).find('[name="products"]').val();
					var ProdNameStr = $(this)
						.find('[name="products"] option:selected')
						.val();
					var RelatedID = $(this).find('[name="RelatedID"]').val();
					var AreaVar = $(this).find('[name="customerArea"]').val();
					Customer_details["Customer_Name"] = {
						name: customer_name,
						id: customer_id,
					};
					// Customer_details["Product_Classification1"] = {
					//     name: product_name,
					//     id: product_id
					// };
					if (product_id != "") {
						Customer_details["Product_Classification1"] = {
							name: product_name,
							id: product_id,
						};
					}
					if (ProductName != "") {
						Customer_details["Product_Name"] = {
							name: ProdNameStr,
							id: ProductName,
						};
					}
					Customer_details["Related_Id"] = RelatedID;
					Customer_details["Area"] = AreaVar;

					Customer_details["Purpose"] = customer_purpose;
					Customer_details["Related_Record"] = $(this)
						.find('[name="RelatedID"]')
						.val();
					// console.log(Customer_details);
					if (customer_purpose == "") {
						console.log("A");
						$("#exampleModalCenter .modal-body").html(
							"Please choose the purpose."
						);
						$("#exampleModalCenter").modal("show");
						//return;
						throw new Error(
							"This is not an error. This is just to abort javascript"
						);
					}
					customers.push(Customer_details);
					console.log(Customer_details);
				});
				console.log(customers.length);
				if (Activity_Type == "Field Work") {
					console.log("Field work");
					if (customers.length == 0) {
						// $('#exampleModalCenter .modal-title').html('Alert');
						$("#exampleModalCenter .modal-body").html(
							"Please Add Atleast one Customer"
						);
						$("#exampleModalCenter").modal("show");
						return;
					}
				}
				//Insert SJp
				var recordData = {
					Activity_type: Activity_Type,
					Approval_Status: "Draft",
					Date: datetime,
					Event_Title: Name,
					Type: "Service",
					Day: Day,
					Field_work_Type: Fieldwork_Type,
					Area_Type: Area_Type,
					Areas_Planned: Areas,
					FLSP_HQ: FLSP_HQ,
					HQ: HQ,
					Meeting_Type: MeetingType,
					Marketing_Activity_Type: Marketing_Activity_Type,
					Office_Type: Office_Type,
					Role: Role,
					Staff_Name: Staff_Name,
					Name: Name,
					Owner: {
						Name: SJP.currentUserName,
						id: SJP.logged_User,
					},
					// "SJP_Subform": customers_records
				};
				if (customers.length != 0) {
					// var customers_records = "SJP_Subform": customers;
					recordData["SJP_Subform"] = customers;
				}
				console.log(recordData);
				ZOHO.CRM.API.insertRecord({
					Entity: "SJP_CRM",
					APIData: recordData,
					Trigger: ["workflow"],
				}).then(function (data) {
					console.log("DATA----------------");
					console.log(data);
					var sucess_details = {};
					var eventid = data.data[0].details.id;
					var eventObj = {
						title: Name,
						start: datetime,
						event_id: eventid,
						color: "gray",
						textColor: "#fff",
					};
					setupEventAndRedirectCal(eventObj);
					console.log(data);
					SJP.status = "Draft";
					SJP.noOfEventsInAMonth = SJP.noOfEventsInAMonth + 1;
					$("#cancel").click();
					sendApprovalUpdate(1, "Please Wait....");
					$("#send-approval").attr("disabled", true);
					setTimeout(function () {
						sendApprovalUpdate(1, "Send for approval");
						$("#send-approval").attr("disabled", false);
					}, 90000);
				});
				console.log();
				console.log(
					"SJP INSERT----------------------------------------------END--"
				);
			} else {
				//Get the Approved Status for the selected event End Naresh

				if (
					SJP.Approve_Status_onclick_event == "Rejected" ||
					SJP.Approve_Status_onclick_event == "Modified"
				)
					Status = "Modified";
				else if (
					SJP.Approve_Status_onclick_event == "Approved" ||
					SJP.Approve_Status_onclick_event == "Deviated"
				)
					Status = "Approved";
				else Status = "Draft";
				console.log(Status);
				//Get the Approved Status for the selected event End Naresh
				console.log("SJP UPDATE --------------------------------");
				var customers = [];
				$(".customers tbody tr").each(function () {
					var Customer_details = {};
					console.log($(this).attr("data-id"));
					if ($(this).attr("data-id")) {
						Customer_details["id"] = $(this).attr("data-id");
					} else {
						var customer_id = $(this).find('[name="customer"]').val();
						var customer_name = $(this)
							.find('[name="customer"] option:selected')
							.text();
						var product_id = $(this).find('[name="product"]').val();
						var product_name = $(this)
							.find('[name="product"] option:selected')
							.text();
						var customer_purpose = $(this).find('[name="purpose"]').val();
						var ProductName = $(this).find('[name="products"]').val();
						var ProdNameStr = $(this)
							.find('[name="products"] option:selected')
							.val();
						var RelatedID = $(this).find('[name="RelatedID"]').val();
						var AreaVar = $(this).find('[name="customerArea"]').val();
						Customer_details["Customer_Name"] = {
							name: customer_name,
							id: customer_id,
						};
						// Customer_details["Product_Classification1"] = {
						//     name: product_name,
						//     id: product_id
						// };
						if (product_id != "") {
							Customer_details["Product_Classification1"] = {
								name: product_name,
								id: product_id,
							};
						}
						if (ProductName != "") {
							Customer_details["Product_Name"] = {
								name: ProdNameStr,
								id: ProductName,
							};
						}
						Customer_details["Related_Id"] = RelatedID;
						Customer_details["Area"] = AreaVar;

						Customer_details["Purpose"] = customer_purpose;
						Customer_details["Related_Record"] = $(this)
							.find('[name="RelatedID"]')
							.val();
					}
					// console.log(Customer_details);
					if (customer_purpose == "") {
						console.log("A");
						$("#exampleModalCenter .modal-body").html(
							"Please choose the purpose."
						);
						$("#exampleModalCenter").modal("show");
						//return;
						throw new Error(
							"This is not an error. This is just to abort javascript"
						);
					}
					customers.push(Customer_details);
					console.log(Customer_details);
				});
				if (Activity_Type == "Field Work") {
					if (customers.length == 0) {
						// $('#exampleModalCenter .modal-title').html('Alert');
						$("#exampleModalCenter .modal-body").html(
							"Please Add Atleast one Customer"
						);
						$("#exampleModalCenter").modal("show");
						return;
					}
				}
				console.log(customers);
				if (SJP.is_backendEvent == true) {
					console.log("Backendevent" + SJP.is_backendEvent);
					var config = {
						Entity: "SJP_CRM",
						APIData: {
							id: $("#selectedEventId").val(),
							Activity_type: Activity_Type,
							Approval_Status: Status,
							Date: datetime,
							Type: "Service",
							Day: Day,
							Field_work_Type: Fieldwork_Type,
							Area_Type: Area_Type,
							Areas_Planned: Areas,
							FLSP_HQ: FLSP_HQ,
							HQ: HQ,
							Meeting_Type: MeetingType,
							Marketing_Activity_Type: Marketing_Activity_Type,
							Office_Type: Office_Type,
							Role: Role,
							Staff_Name: Staff_Name,
							Name: Name,
							Owner: {
								Name: SJP.currentUserName,
								id: SJP.logged_User,
							},
							// "SJP_Subform": customers
						},
					};
				} else {
					var config = {
						Entity: "SJP_CRM",
						APIData: {
							id: $("#selectedEventId").val(),
							Activity_type: Activity_Type,
							Approval_Status: Status,
							Date: datetime,
							Event_Title: Name,
							Type: "Service",
							Day: Day,
							Field_work_Type: Fieldwork_Type,
							Area_Type: Area_Type,
							Areas_Planned: Areas,
							FLSP_HQ: FLSP_HQ,
							HQ: HQ,
							Meeting_Type: MeetingType,
							Marketing_Activity_Type: Marketing_Activity_Type,
							Office_Type: Office_Type,
							Role: Role,
							Staff_Name: Staff_Name,
							Name: Name,
							Owner: {
								Name: SJP.currentUserName,
								id: SJP.logged_User,
							},
							// "SJP_Subform": customers
						},
					};
				}
				if (customers.length != 0) {
					config.APIData["SJP_Subform"] = customers;
				}
				console.log(config);

				ZOHO.CRM.API.updateRecord(config).then(function (data) {
					console.log(config);
					console.log("UPDATED RECORED----------------");
					console.log(data);
					var eventid = $("#selectedEventId").val();
					ZOHO.CRM.API.getRecord({
						Entity: "SJP_CRM",
						RecordID: eventid,
					}).then(function (data) {
						console.log("data");
						console.log(data.data[0].Approval_Status);
						var check_status_response = data.data[0].Approval_Status;
						if (check_status_response == "Modified") {
							var eventObj = {
								title: Name,
								start: datetime,
								event_id: eventid,
								color: "#A45EA1",
								textColor: "#000",
							};
						}
						if (check_status_response == "Draft") {
							var eventObj = {
								title: Name,
								start: datetime,
								event_id: eventid,
								color: "gray",
								textColor: "#fff",
							};
						}
						if (check_status_response == "Approved") {
							var eventObj = {
								title: Name,
								start: datetime,
								event_id: eventid,
								color: "green",
								textColor: "#FFF",
							};
						}
						if (check_status_response == "Rejected") {
							var eventObj = {
								title: Name,
								start: datetime,
								event_id: eventid,
								color: "red",
								textColor: "#FFF",
							};
						}
						if (check_status_response == "Deviated") {
							var eventObj = {
								title: Name,
								start: datetime,
								event_id: eventid,
								color: "#2E9AFE",
								textColor: "#FFF",
							};
						}
						setupEventAndRedirectCal(eventObj);
						console.log("UPDATED RECORED----------------END");
					});
				});

				sendApprovalUpdate(1, "Send for approval");
				$("#send-approval").attr("disabled", false);
				console.log(recordData);
				console.log(
					"SJP UPDATE----------------------------------------------END--"
				);
			}
			$("#formScreen").hide();
			$("#wrap").show();
			customSortSelectAreas = [];
		});

		SJP.getUserRole();
		//Function TBC
		function getFlseIndependentAreas(pageNumber) {
			console.log("SS:getFLSEAreas", areasPreSelectedArray, pageNumber);
			if (SJP.is_edit == 0) {
				console.log("inside edit");
				console.log(areasPreSelectedArray);
				$("#Area_Selector").val("");
			}
			var moreRecords;
			var currentUserHqId = $("#userHqId").val();
			if (SJP.checkAreaChange == 1) {
				console.log("areasPreSelectedArray below");
				console.log("areas after sorttt");
				console.log(areasPreSelectedArray);
				if (areasPreSelectedArray) {
					areasPreSelectedArray = areasPreSelectedArray.sort(function (a, b) {
						if (a < b) return -1;
						else if (a > b) return 1;
						return 0;
					});
				}

				console.log("areas after sort");
				console.log(areasPreSelectedArray);
				var selectedAreas = "";
				$.each(areasPreSelectedArray, function (key, val) {
					console.log("selected areas =>" + val);
					selectedAreas += '<option selected="selected">' + val + "</option>";
				});
				console.log("selectedAreas");
				console.log(selectedAreas);
				var areasstr = areasPreSelectedArray.toString();
				$(".FlspAndIndependent").show();
				$(".field-work-area-type").show();
				if (pageNumber == 1) {
					$("#Area_Selector").append(selectedAreas); // ! append in area
					$(".selectpicker").selectpicker("refresh");
				}
				console.log(pageNumber);
				//API to get all other areas
				getAllAreas(currentUserHqId, areasPreSelectedArray, [], 1);
				// ZOHO.CRM.API.searchRecord({
				// 	Entity: "Area_Type_Master",
				// 	sort_order: "asc",
				// 	per_page: 200,
				// 	page: pageNumber,
				// 	Type: "criteria",
				// 	Query: "(HQ:equals:" + currentUserHqId + ")",
				// }).then(function (data) {
				// 	console.log(data);
				// 	console.log("to get other areas in FLSP and INdependent");
				// 	console.log(data);
				// 	moreRecords = data.info.more_records;
				// 	var otherAreas = "";
				// 	var sortcus = [];
				// 	$.each(data.data, function (key, val) {
				// 		if (!areasPreSelectedArray.includes(val.Name)) {
				// 			console.log("Includes Areas" + val.Name);
				// 			//otherAreas += '<option>' + val.Name + '</option>';
				// 			// sortcus.push(val.Name);
				// 			customSortSelectAreas.push(val.Name);
				// 		} else {
				// 			console.log("not included areas" + val.Name);
				// 		}
				// 	});
				// 	if (moreRecords == true) {
				// 		pageNumber++;
				// 		console.log(pageNumber);
				// 		getFlseIndependentAreas(pageNumber);
				// 	}
				// 	if (moreRecords == false) {
				// 		//var sortSelectArea = sortcus.sort(function (a, b) {
				// 		var sortSelectArea = customSortSelectAreas.sort(function (a, b) {
				// 			if (a < b) return -1;
				// 			else if (a > b) return 1;
				// 			return 0;
				// 		});
				// 		console.log(sortSelectArea);
				// 		$.each(sortSelectArea, function (key2, val2) {
				// 			if (SJP.Planned_Area.includes(val2)) {
				// 				otherAreas +=
				// 					'<option style="background-color:#90EE90;font-weight:bold;">' +
				// 					val2 +
				// 					"</option>";
				// 			} else {
				// 				otherAreas += "<option>" + val2 + "</option>";
				// 			}
				// 			// otherAreas += '<option>' + val2 + '</option>';
				// 		});
				// 	}

				// 	$("#Area_Selector").append(otherAreas);
				// 	$(".selectpicker").selectpicker("refresh");
				// });
				//SJP.checkAreaChange = 0;
			} else {
				if (SJP.is_edit == 0) {
					console.log("inside edit");
					console.log(areasPreSelectedArray);
					$("#Area_Selector").val("");
				}
				console.log("SS:getFLSEAreas", "Else Case");
				getAllAreas(currentUserHqId, areasPreSelectedArray, [], 1);
				// ZOHO.CRM.API.searchRecord({
				// 	Entity: "Area_Type_Master",
				// 	sort_order: "asc",
				// 	per_page: 200,
				// 	page: pageNumber,
				// 	Type: "criteria",
				// 	Query: "(HQ:equals:" + currentUserHqId + ")",
				// }).then(function (data) {
				// 	console.log("below is data for RBH on select of independent");
				// 	console.log(data);
				// 	moreRecords = data.info.more_records;
				// 	var data = data.data;
				// 	var selectedAreas = "";
				// 	sortSelectedAreas = [];
				// 	$.each(data, function (key, val) {
				// 		//selectedAreas += '<option>' + val.Name + '</option>';
				// 		customSortSelectAreas.push(val.Name);
				// 	});

				// 	if (moreRecords == true) {
				// 		pageNumber++;
				// 		console.log(pageNumber);
				// 		getFlseIndependentAreas(pageNumber);
				// 	}
				// 	if (moreRecords == false) {
				// 		sortedSelectedAreas = customSortSelectAreas.sort(function (a, b) {
				// 			if (a < b) return -1;
				// 			else if (a > b) return 1;
				// 			return 0;
				// 		});
				// 		console.log("areas after sort");
				// 		console.log(sortedSelectedAreas);
				// 		$.each(areasPreSelectedArray, function (key, val) {
				// 			console.log("selected areas =>" + val);
				// 			selectedAreas +=
				// 				'<option selected="selected">' + val + "</option>";
				// 		});

				// 		$.each(sortedSelectedAreas, function (key, val) {
				// 			if (!areasPreSelectedArray.includes(val.Name)) {
				// 				if (SJP.Planned_Area.includes(val)) {
				// 					selectedAreas +=
				// 						'<option style="background-color:#90EE90;font-weight:bold;">' +
				// 						val +
				// 						"</option>";
				// 				} else {
				// 					console.log("Includes Areas" + val.Name);
				// 					selectedAreas += "<option>" + val + "</option>";
				// 				}
				// 				// console.log("Includes Areas" + val.Name);
				// 				// selectedAreas += '<option>' + val + '</option>';
				// 			} else {
				// 				console.log("not included areas" + val.Name);
				// 			}
				// 		});
				// 	}
				// 	$(".FlspAndIndependent").show();
				// 	$(".field-work-area-type").show();
				// 	$("#Area_Selector").append(selectedAreas);
				// 	$(".selectpicker").selectpicker("refresh");
				// 	$(function () {
				// 		// choose target dropdown
				// 		var select = $("#Area_Selector");
				// 		select.html(
				// 			select.find("option").sort(function (x, y) {
				// 				// to change to descending order switch "<" for ">"
				// 				return $(x).text() > $(y).text() ? 1 : -1;
				// 			})
				// 		);

				// 		// select default item after sorting (first item)
				// 		// $('select').get(0).selectedIndex = 0;
				// 	});
				// });
			}
		}

		$("#Area_Selector").prop("disabled", true);
		console.error("THE LAST LINE!")
	});
	ZOHO.embeddedApp.init();
	// });
	SJP.customers();
});

function getAllRECORDS(pageNumber, dropdownID, checkUser, userList) {
	var more_records;
	console.log("in custom function");
	ZOHO.CRM.API.getAllRecords({
		Entity: "Employee_Master",
		sort_order: "asc",
		per_page: 200,
		page: pageNumber,
	})
		//ZOHO.CRM.API.getAllRecords({ Entity: "Employee_Master", sort_order: "asc", per_page: 200, page: pageNumber })
		.then(function (data) {
			console.log("user-listentry");
			console.log(data);
			console.log(data.info.more_records);
			more_records = data.info.more_records;
			var userId = $("#userId").val();
			var myUsers = "";
			if (userList != "") {
				myUsers = userList;
			} else {
				myUsers = "";
			}
			if (dropdownID == "#users-list") {
				console.log(dropdownID);
				$.each(data.data, function (key, val) {
					var selected = userId == val.Owner.id ? "selected" : "";
					userList +=
						"<option value=" +
						val.Owner.id +
						" " +
						selected +
						">" +
						val.Owner.name +
						"</option>";
					console.log("user-list");

					// console.log("user-list");
					if (SJP.logged_User == val.Owner.id) {
						// console.log(val.id);
						SJP.Selected_User = val.Owner.id;
						SJP.Selected_UserName = val.Owner.name;
					}
					// console.log(SJP);
					// console.log("user-list end");
				});
			}
			if (dropdownID == "#staff-name") {
				console.log(dropdownID);
				$.each(data.data, function (key, val) {
					userList +=
						"<option value='" +
						val.Owner.name +
						"' data-email='" +
						val.Email +
						"' ' data-id='" +
						val.Owner.id +
						"'>" +
						val.Owner.name +
						"</option>";
				});
				if (SJP.is_edit == 1) {
					if (checkUser != null) {
						if (checkUser.data[0].Staff_Name) {
							$("#staff-name option").each(function () {
								console.log(checkUser.data[0].Staff_Name.id);
								console.log($(this).data("id"));
								if ($(this).data("id") == checkUser.data[0].Staff_Name.id)
									$(this).attr("selected", "selected").trigger("change");
							});
						}
					}
				}
				$(dropdownID).empty();
			}

			if (more_records == true) {
				//pageNumber++;
				console.log("in if loop" + pageNumber);
				pageNumber++;
				getAllRECORDS(pageNumber, dropdownID, checkUser, userList);
			} else {
				$(function () {
					// choose target dropdown
					var select = $(dropdownID);
					select.html(
						select.find("option").sort(function (x, y) {
							// to change to descending order switch "<" for ">"
							return $(x).text() > $(y).text() ? 1 : -1;
						})
					);

					// select default item after sorting (first item)
					// $('select').get(0).selectedIndex = 0;
				});
				console.log(SJP.logged_User);
				$(".staff-name option").val(function (idx, val) {
					$(this)
						.siblings('[value="' + val + '"]')
						.remove();
				});
				console.log($(".staff-name").val());
				$(dropdownID).empty();
				console.log("SS:UserList", userList);
				$(dropdownID).append(userList);
				if (SJP.is_edit == 1) {
					console.log("here i am");
					if (checkUser.data[0].Staff_Name) {
						$("#staff-name option").each(function () {
							console.log(checkUser.data[0].Staff_Name.id);
							console.log($(this).data("id"));
							if ($(this).data("id") == checkUser.data[0].Staff_Name.id)
								$(this).attr("selected", "selected").trigger("change");
						});
					}
				}
				console.log($("#users-list").find("option").length);
				console.log($("#staff-name").find("option").length);
				if ($("#userRole").val() != "FLSP") {
					$("#users-list").show();
				} else {
					$("#users-list").hide();
				}
			}
		});
}

function getAllAreas(hqId, selectedAreas, otherAreas, pagenumber) {
	console.log("hqId -- line 3206 -- " + hqId);
	console.log("selectedAreas -- line 3207 -- " + selectedAreas);
	console.log("otherAreas -- line 3208 -- " + otherAreas);
	console.log("pagenumber -- line 3209 -- " + pagenumber);

	ZOHO.CRM.CONNECTION.invoke("widgetconnection", {
		url:
			"https://www.zohoapis.in/crm/v5/Area_Type_Master/search?criteria=(HQ:equals:" +
			hqId +
			")&perpage=200&page=" +
			pagenumber,
		method: "GET",
		param_type: 1,
	}).then(function (data) {
		console.log("SS:GetAllAreas Invoked", data);
		if (data.code == "SUCCESS") {
			console.log("SS:Pagination", data.details);
			response = data.details.statusMessage;
			moreRecords = response.info.more_records;
			console.log(response);
			console.log("SS:Pagination", response.info);
			// var checkDuplicates = selectedAreas.split(",");
			// console.log(checkDuplicates);
			if ($("#staff-name").val() == null) {
				selectStaff();
			}
			$.each(response.data, function (key, val) {
				otherAreas.push(val.Name);
			});
			if (moreRecords == true) {
				console.log("SS: Enter Areas more records");
				pagenumber++;
				console.log("SS:Page", pagenumber);
				// console.log("SS:Page", pagenumber);

				getAllAreas(hqId, selectedAreas, otherAreas, pagenumber);
			} else {
				SSOtherAreas = otherAreas;
				var insertAllAreas = ""; // ! area type - declared variable with "var"
				otherAreas.sort();
				$.each(otherAreas, function (key, val) {
					if (selectedAreas.includes(val)) { // ! area type - added one more condition to check if it is actually present or not
						insertAllAreas += "<option selected>" + val + "</option>";
					} else {
						insertAllAreas += "<option>" + val + "</option>";
					}
				});
				$.each(selectedAreas, function (key, selectedArea) {
					if (!otherAreas.includes(selectedArea)) {
						insertAllAreas += "<option selected>" + selectedArea + "</option>";
					}
				});
				console.log("SS: inserted areas to dropdown", insertAllAreas);
				$("#Area_Selector").empty();
				$("#staffAreaSelect").empty();
				$("#Area_Selector").append(insertAllAreas); // ! append in area
				$("#staffAreaSelect").append(insertAllAreas);
				$(".selectpicker").selectpicker("refresh");
			}
		}
	});
}

function selectStaff() {
	console.log("select staff function");
	if ($("#staff-name").val() == null) {
		if (SJP.with_Staffid != null) {
			$("#staff-name option").each(function () {
				//console.log(checkUser.data[0].Staff_Name.id);
				console.log($(this).data("id"));
				if ($(this).data("id") == SJP.with_Staffid) {
					console.log("insideif");
					$('#staff-name option[value="' + SJP.with_Staffname + '"]').prop(
						"selected",
						true
					);
				}
			});
		}
	}
}
//---------------------------VAlign Code---------------------------
/*function showAreas(userHQID, area_arr = []) {
=======

function showAreas(userHQID, area_arr = []) {
	let optionsLength = document.getElementById("Area_Selector").length;
>>>>>>> harsha_23012020_1103am
	//API TO GET area--------------------------------------------------------------------------------
	$('#Area_Selector').empty();
	console.log("Emptied I Guess");
	ZOHO.CRM.API.searchRecord({
			Entity: "Area_Type_Master",
			Type: "criteria",
			Query: "(HQ:equals:" +
				userHQID + ")"
		})
		.then(function(data) {
			console.log("I am in Areas API");
			//$('#Area_Selector').empty();
			console.log(userHQID);
			console.log(data.data[0].Name);
			//var areaName = data.data[0].Name
			//var data = data.data[0].Areas;
			console.log(data);
			//var ele = document.getElementById('Area_Selector');
			var otherAreas = '';
			$.each(data.data, function(key, val) {
				otherAreas += '<option value = "' + val.Name + '">' + val.Name + '</option>';

			});
			console.log("Printing all areas : " + otherAreas);
			$('#Area_Selector').append(otherAreas);
			console.log("_________disorder appending");
			var options = $("#Area_Selector option"); // Collect options
			options.detach().sort(function(a, b) { // Detach from select, then Sort
				var at = $(a).text();
				var bt = $(b).text();
				return (at > bt) ? 1 : ((at < bt) ? -1 : 0); // Tell the sort function how to order
			});
			$('#Area_Selector').empty();
			console.log("_________order appending");
			options.appendTo("#Area_Selector");
			$('.selectpicker').selectpicker('refresh');
			if (area_arr.length > 0) {
				$.each(area_arr, function(k, v) {
					$('#Area_Selector option[value="' + v + '"]').attr('selected', 'selected');
				});
				$('.selectpicker').selectpicker('refresh');
			}
			// $('.areaSelector').append(otherAreas);
		});
}*/
//---------------------------VAlign Code---------------------------
//-----------------------------------------------------------------------------------------------


async function fixForAreaType(selectedArea, staffHqId) {
	console.log("fixForAreaType -->| ", $(".staff-name option:selected").attr("data-email"))
	console.log("fixForAreaType area type -->| ", $("#area_type").val())

	var config = {
		select_query:
			"select Area_Type from Area_Type_Master where Name in (" +
			selectedArea +
			") and HQ = '" +
			staffHqId +
			"'",
	};
	const areaResult = await ZOHO.CRM.API.coql(config);
	console.log("areaResult -->| ", config, areaResult);
	if(areaResult?.data && areaResult?.data.length > 0){
		$("#area_type").val(areaResult?.data[0].Area_Type)
	}
}