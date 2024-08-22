var selectedYear = '';
var cal ={
    calMonth:"",
    calYear:""
};
/* calendar JS */
var selectedYear = '';
//var Fieldwork_Type_From_Edit = '';
var calendarEventClickedObj;
var TP = {
    status : null,
    Selected_User : null ,
    Selected_UserName : null,
    logged_User : null,
    currentUserName : null,
    userRole : null,
    noOfWorkingDays : null,
    noOfEventsInAMonth : 0,
    is_edit : 0,
    checkAreaChange : 0,
    reject_reason : null,
    eventIdForDelete : null,
    userHq : null
};
$(function(){
    TP.Init();
});

TP.Init = function(){
    TP.setupSendApproval()
}
TP.setupSendApproval = function(){
}
var areasPreSelectedArray;
$(document).ready(function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $('#cancel').click(function(e) {
       e.preventDefault();
       $("#wrap").show();
       $("#formScreen").hide();
       $('.field-work-day').hide();
       $('.staffName').hide();
       $('.FlspHq').val('');
       $('.FlspHq').hide(); // to be changed
       $('#selectActivity').val("").trigger('change');

   });
   $('#reset').click(function(e) {
       e.preventDefault();
       $('.field-work-day').hide();
       $('.staffName').hide();
       $('.FlspHq').val('');
       $('.FlspHq').hide(); //to be changed
       $('#selectActivity').val("").trigger('change');
       $('#selectActivity').val("");
   });
   $('#delete').click(function(e) {
        e.preventDefault();
       console.log(TP.eventIdForDelete);
       var event_id = TP.eventIdForDelete;
       deleteEvent(event_id);
     });
   $('#users-list').change(function() {
        var UserId = $('#users-list').val();
        var Selected_UserName = $('[name="user-list"] option:selected').text();
        TP.Selected_User = UserId;
        TP.Selected_UserName = Selected_UserName;
        TP.setUpCal(UserId);
    });
    $('#approve_status').click(function(){
        var Approve = $.data(val);
    });
    /* initialize the external events
    -----------------------------------------------------------------*/
    $('#external-events div.external-event').each(function() {
        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        });

    });
    /* initialize the calendar
    -----------------------------------------------------------------*/
    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'title',
            center: 'month',
            right: 'prev,next'
        },
        editable: true,
        eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, date) {
           var curr_date = new Date();
           var selectedDay = event.start.getDate();
           var selectedMonth = event.start.getMonth() + 1;
           console.log(event.start.getDay());
           var selectedYear = event.start.getFullYear();
           var current_date = curr_date.getFullYear() + '-' + (curr_date.getMonth() + 1) + '-' + curr_date.getDate();
           var selected_date = selectedYear + '-' + selectedMonth + '-' + selectedDay;
           var events = $('#calendar').fullCalendar('clientEvents');
           var current_date_events = '';
           var cehckDays = [];
           var droppableMonth = event.start.getMonth() + 1;
           for (var i = 0; i < events.length; i++) {
               var start_date = new Date(events[i].start);
               var end_date = '';
               var st_day = start_date.getDate();
               cehckDays.push(st_day);
               var st_monthIndex = start_date.getMonth() + 1;
               var st_year = start_date.getFullYear();
               var event_date = st_year + '-' + st_monthIndex + '-' + st_day;
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
           console.log("SM"+selectedMonth);
           console.log("CM"+cal.calMonth);
           if(cal.calMonth != selectedMonth)
           {   
               // console.log("1"); 
               revertFunc();
           }
           else{
                if(numOccurences > 1)
                   {
                       // console.log("2");
                       revertFunc();
                   }
                else if(event.start.getDay() == 0)
                {
                    revertFunc();
                }
                else{   var event_year = event.start.getFullYear();
                        var event_month = event.start.getMonth()+1;
                        var event_day = event.start.getDate().toString().padStart(2, "0");
                        if(event_month<10) 
                        {
                            event_month='0'+event_month;
                        } 
                        var formate_date =  event_year + '-' + event_month + '-' + event_day;
                        console.log(formate_date);
                        console.log(cal);
                        event_id = event.event_id;
                        var config = {
                        Entity: "TP_CRM",
                        APIData: {
                            "id": event_id,
                            "Date": formate_date,
                        },
                        Trigger: ["workflow"]
                        }
                        ZOHO.CRM.API.updateRecord(config)
                        .then(function(data) {
                            console.log(data);
                        })
                    } 
           }
        },
        firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
        selectable: true,
        defaultView: 'month',
        axisFormat: 'h:mm',
        columnFormat: {
            month: 'ddd', // Mon
            week: 'ddd d', // Mon 7
            agendaDay: 'dddd d'
        },
        titleFormat: {
            month: 'MMMM yyyy', // September 2009
            week: "MMMM yyyy", // September 2009
        },
        allDaySlot: false,
        selectHelper: true,
        select: function(day, date, month, start, end, allDay,jsEvent,view) {
            $('#selectActivity option:eq(0)').prop('selected', true).trigger('change');
            console.log(TP.noOfEventsInAMonth);
            var selectedDay = date.getDate();
            var selectedDayName = date.getDay();
            var selectedMonth = date.getMonth() + 1;
            var selectedYear = date.getFullYear();
            TP.is_edit = 0;
            console.log(TP.is_edit);
            console.log(selectedMonth);
            console.log(cal.calMonth);
            console.log(TP.status);
            var events_count = $('#count_enents').val();
            if(TP.is_edit == 0)
                $('#delete').hide();
           if(TP.Selected_User != TP.logged_User)
                {
                    $('#exampleModalCenter .modal-title').html('Alert');
                    $('#exampleModalCenter .modal-body').html("Sorry!! You can't add TP for this user");
                    $('#exampleModalCenter').modal('show');
                    return;
                }
            else
            {
                if(TP.status == 'Sent' || TP.status == 'Approved')
                {
                    if(selectedMonth == cal.calMonth)
                    {
                        $('#exampleModalCenter .modal-title').html('Alert');
                        $('#exampleModalCenter .modal-body').html("Sorry!! This TP cannot be modified.");
                        $('#exampleModalCenter').modal('show');
                        return;
                    }
                }
            }
            if(selectedDayName == 0)
            {
                $('#exampleModalCenter .modal-title').html('Alert');
                $('#exampleModalCenter .modal-body').html("Sorry!!Cannot Create Tp on Sunday");
                $('#exampleModalCenter').modal('show');
                return;
            }
            if (selectedDay.toString().length == 1) {
                selectedDay = '0' + selectedDay;
            }
            if (selectedMonth.toString().length == 1) {
                selectedMonth = '0' + selectedMonth;
            }
            var curr_date = new Date();
            var curr_year = curr_date.getFullYear();
            var curr_month = curr_date.getMonth()+1;
            var curr_day = curr_date.getDate();
            if(curr_day<10) 
            {
                curr_day='0'+curr_day;
            } 

            if(curr_month<10) 
            {
                curr_month='0'+curr_month;
            }
            var current_date = curr_year + '-' + curr_month + '-' + curr_day;
            var selected_date = selectedYear + '-' + selectedMonth + '-' + selectedDay;
            console.log("date test");
            console.log(current_date);
            console.log(selected_date);
            console.log("date test end");
            if (current_date > selected_date) {

                $('#exampleModalCenter .modal-title').html('Alert');
                $('#exampleModalCenter .modal-body').html('Planning for Past Dates not allowed !!');
                $('#exampleModalCenter').modal('show');
            } 
            else 
            {
                var events = $('#calendar').fullCalendar('clientEvents');
                console.log(events);
                var current_date_events = '';
                for (var i = 0; i < events.length; i++) {
                    var start_date = new Date(events[i].start);
                    var end_date = '';
                    var st_day = start_date.getDate();
                    var st_monthIndex = start_date.getMonth() + 1;
                    var st_year = start_date.getFullYear();
                    if(st_monthIndex<10) 
                    {
                        st_monthIndex='0'+st_monthIndex;
                    } 

                    if(st_day<10) 
                    {
                        st_day='0'+st_day;
                    }
                    var event_date = st_year + '-' + st_monthIndex + '-' + st_day;
                    console.log("selected"+selected_date);
                    console.log("eventdate"+event_date);
                    if (event_date == selected_date) {
                        
                        current_date_events = event_date;
                    }
                }
                if (current_date_events != "") {
                    $('#exampleModalCenter .modal-title').html('Alert');
                    $('#exampleModalCenter .modal-body').html('You already planned !!');
                    $('#exampleModalCenter').modal('show');
                } else {
                    $('#datetimepicker').val(selectedYear + '-' + selectedMonth + '-' + selectedDay);
                    $('#userSelectedYear').val(selectedYear);
                    $("#wrap").hide();
                    $("#formScreen").show();
                }
            }
            //API to gt planned days
            var selectedMonth = $("#calendar").fullCalendar('getDate').getMonth() + 1; 
            var selectedYear = $("#calendar").fullCalendar('getDate').getFullYear();
            var monAndYear = selectedMonth+'-'+selectedYear;
            var currentUserId = TP.logged_User;
            console.log('currentUserId in edit'+currentUserId);
            ZOHO.CRM.API.searchRecord({Entity:'TP_CRM',Type:'criteria',Query:'((Owner:equals:'+currentUserId+') and (TP_Month:equals:'+monAndYear+'))'}) 
            .then(function(data){
                console.log('in event edit');
                console.log(data.data)
                $.each(data.data, function(key,val){
                    if(val.Activity_Type == 'Field Work')
                    {
                         $("#day"+val.Day).prop('disabled', true);
                         console.log('unplanned day'+val.Day);
                    }
                });
            })
        },
        eventClick: function(calEvent, jsEvent, view) {
            TP.is_edit = 1;
            TP.checkAreaChange = 1;
            $('.selectDay option:eq(0)').prop('selected', true);
            console.log('value of cehck');
            console.log($('#checkAreaChange').val());
            if(TP.is_edit == 1 && TP.status != 'Sent')
                $('#delete').show();
            if(TP.status == 'Approved')
                 $('#delete').hide();
            console.log($("#edit").val());
            console.log("eventClick loggedU"+TP.logged_User);
            console.log("eventClick SelectedU"+TP.Selected_User);
            console.log("eventClick User Role "+TP.userRole);
            if(TP.status == 'Sent' || TP.status == 'Approved')
            {
                $(" #formScreen .form-control").attr("disabled", true);
                $(" #formScreen .form-control .areaSelector").attr("disabled", false);
                $(" #formScreen .form-control #staffAreaSelect").attr("disabled", false);
                $('.submit').attr("disabled", true);
                $('.reset').attr("disabled", true);
            }
            var logged_User = $('#userId').val();
            if (TP.logged_User != TP.Selected_User) {
                if(TP.status == 'Draft' && TP.userRole != 'FLSP')
                {
                    $("#formScreen .form-control").attr("disabled", true);
                    $('.submit').attr("disabled", true);
                    $('.reset').attr("disabled", true);
                    $('#delete').hide();

                }
            }
            calendarEventClickedObj = calEvent;
            var selectedYear = $("#calendar").fullCalendar('getDate').getFullYear(); 
            $('#userSelectedYear').val(selectedYear);
            var name = calEvent.title;
            var event_id = calEvent.event_id;
            TP.eventIdForDelete = event_id;
            $('#edit').val("1");
            $('.customers tbody tr').remove();
            ZOHO.CRM.API.getRecord({
                Entity: "TP_CRM",
                RecordID: event_id
            }).then(function(data) {
                console.log('all edit dataa');
                console.log(data);
                var areasPreSelected = data.data[0].Areas;
                if(areasPreSelected)
                    areasPreSelectedArray = areasPreSelected.split(',');
                $("#selectedEventId").val(data.data[0].id);
                $("#wrap").hide();
                $("#userName").val(data.data[0].Owner.name);
                $("#userHq").val(data.data[0].HQ);
                $(".selectRole").val(data.data[0].Role);
                $("#datetimepicker").val(data.data[0].Date);
                $('.selectpicker').val('testing');
                $("#selectActivity").val(data.data[0].Activity_Type).trigger('change');
                $('#selectFieldWorkType').val(data.data[0].Fieldwork_Type).trigger('change');
                $("#userId").val(data.data[0].Owner.id);
                /*ZOHO.CRM.API.getAllUsers({
                        Type: "ActiveUsers"
                    })
                    .then(function(userdata) {
                        var allUsers = userdata.users;
                        var users = '';
                        $.each(allUsers, function(key, val) {
                            users += "<option value='" + val.full_name + "' data-email='" + val.email + "' ' data-id='" + val.id + "'>" + val.full_name + "</option>";
                        });
                        $('#staff-name').empty();
                        $('#staff-name').append(users);

                        if(data.data[0].Staff_Name)
                        {
                            $("#staff-name option").each(function() {
                                if ($(this).data("id") == data.data[0].Staff_Name.id)
                                    $(this).attr("selected", "selected").trigger('change');
                            });
                        }
                    });*/
                    /*console.log("Get All USers");
                    console.log('below is the staff name');
                    console.log(data.data[0].Staff_Name.id);
                    ZOHO.CRM.API.getAllRecords({Entity:"Employee_Master",sort_order:"asc",per_page:100,page:1})
                    .then(function(data){
                       console.log('below is data from new API to get all users');
                       console.log(data)
                            var allUsers = data.data;
                            var users = '';
                            console.log('before each for users');
                            $.each(allUsers, function(key, val) {
                                users += "<option value='" + val.Owner.name + "' data-email='" + val.Email + "' ' data-id='" + val.Owner.id + "'>" + val.Owner.name + "</option>";
                            });
                            $('#staff-name').empty();
                            $('#staff-name').append(users);
                            console.log('after each for users');

                            if(data.data[0].Staff_Name)
                            {   
                                $("#staff-name option").each(function() {
                                    console.log(data.data[0].Staff_Name.id);
                                    console.log($(this).data("id"));
                                    if ($(this).data("id") == data.data[0].Staff_Name.id)
                                        $(this).attr("selected", "selected").trigger('change');
                                });
                            }
                            console.log('after condition loop');
                        });
                    console.log("Get All USers");*/
                var areasPreSelected = data.data[0].Areas;
                console.log('below are the areasPreSelected');
                console.log(areasPreSelected);
                if(areasPreSelected)
                    areasPreSelectedArray = areasPreSelected.split(',');
                if(data.data[0].Day == null)
                {
                    $('.selectDay option:eq(0)').prop('selected', true);    
                }
                console.log("data.data[0]");
                console.log(data.data[0].Day);
                console.log("data.data[0]");
                $(".selectDay").val(data.data[0].Day).trigger('change');
                $("#office-type").val(data.data[0].Office_Type);
                $("#marketingType").val(data.data[0].Marketing_Activity_Type);
                $("#meetingType").val(data.data[0].MeetingType);
                $("#fisp-hq").val(data.data[0].FLSP_HQ);
                $('#checkDayChange').val(1);
                //API to gt planned days
                var selectedMonth = $("#calendar").fullCalendar('getDate').getMonth() + 1; 
                var selectedYear = $("#calendar").fullCalendar('getDate').getFullYear();
                var monAndYear = selectedMonth+'-'+selectedYear;
                var currentUserId = TP.logged_User;
                console.log('currentUserId in edit'+currentUserId);
                ZOHO.CRM.API.searchRecord({Entity:'TP_CRM',Type:'criteria',Query:'((Owner:equals:'+currentUserId+') and (TP_Month:equals:'+monAndYear+'))'}) 
                .then(function(data){
                    console.log('in event edit');
                    console.log(data.data)
                    $.each(data.data, function(key,val){
                        if(val.Activity_Type == 'Field Work')
                        {
                             $("#day"+val.Day).prop('disabled', true);
                             console.log('planned day in event click'+val.Day);
                        }
                    });
                })
                //Add here  
                var checkUser = data;
                console.log(checkUser);
                if(data.data[0].Activity_Type == "Field work")
                {
                    if(data.data[0].Fieldwork_Type != 'Distributor Visit')
                    {
                        console.log("Get All USers");
                        console.log('below is the staff name');
                        console.log(checkUser.data[0].Staff_Name.id);
                        ZOHO.CRM.API.getAllRecords({Entity:"Employee_Master",sort_order:"asc",per_page:100,page:1})
                        .then(function(data){
                                console.log('below is data from new API to get all users');
                                console.log(data)
                                var allUsers = data.data;
                                var users = '';
                                console.log('before each for users');
                                $.each(allUsers, function(key, val) {
                                    users += "<option value='" + val.Owner.name + "' data-email='" + val.Email + "' ' data-id='" + val.Owner.id + "'>" + val.Owner.name + "</option>";
                                });
                                $('#staff-name').empty();
                                $('#staff-name').append(users);
                                console.log('after each for users');

                                if(checkUser.data[0].Staff_Name)
                                {   
                                    $("#staff-name option").each(function() {
                                        console.log(checkUser.data[0].Staff_Name.id);
                                        console.log($(this).data("id"));
                                        if ($(this).data("id") == checkUser.data[0].Staff_Name.id)
                                            $(this).attr("selected", "selected").trigger('change');
                                    });
                                }
                                console.log('after condition loop');
                            });
                        console.log("Get All USers");
                    }
                }
                $('#wrap').hide();
                $('#formScreen').show();
            })
        },
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function(date, allDay) { // this function is called when something is dropped
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
        }
    });
    /* Updating  Current Month And Year at Initial Time and On click  of Prev And Next*/
    $('.fc-button-prev').click(function(){
        var Current_Month = $("#calendar").fullCalendar('getDate').getMonth();
        var Current_Year = $("#calendar").fullCalendar('getDate').getFullYear();
            cal.calMonth = Current_Month+1;
            cal.calYear = Current_Year;
        console.log("On click of prev btn"+cal.calMonth+cal.calYear);
        console.log(TP.userRole);
        if(TP.userRole != 'FLSP')
        {
            TP.setUpCal(TP.Selected_User);
            console.log(TP.Selected_User);
            sendApprovalUpdate(0, "");

        }
        else{
            TP.setUpCal(TP.logged_User);
             console.log(TP.logged_User);
        }
    });
    $('.fc-button-next').click(function(){
            var Current_Month = $("#calendar").fullCalendar('getDate').getMonth();
            var Current_Year = $("#calendar").fullCalendar('getDate').getFullYear();
            cal.calMonth = Current_Month+1;
            cal.calYear = Current_Year;
            console.log("On click of next btn"+cal.calMonth+cal.calYear);
            console.log(TP.userRole);
        if(TP.userRole != 'FLSP')
        {
            TP.setUpCal(TP.Selected_User);
            console.log(TP.Selected_User);
        }
        else{
            TP.setUpCal(TP.logged_User);
             console.log(TP.logged_User);
            sendApprovalUpdate(0, "");
        }
    });
    /* End Updating  Current Month And Year at Initial Time and On click  of Prev And Next*/
    /*initially hidding send for approval and delete btn*/
    $("#send-approval").hide();
    $("#delete").hide();
    var events = $('#calendar').fullCalendar('clientEvents');
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
    var userRole = $('.selectRole option:selected').text();
    $('.field-work-day').hide();
    $('.field-work-area').hide();
    $('.field-work-area-type').hide();
    $('.fieldWorkType').hide();
    $('.meeting').hide();
    $('.office').hide();
    $('.fieldWorkType').hide();
    $('.FlspHq').hide();
    $('.staffName').hide();
    $('.marketingTypeContainer').hide();
    $('#selectActivity').change(function() {
        if(TP.is_edit == 0)
        {
            $('#selectFieldWorkType').val('Select Field Work Type');
            $('#staff-name').val('Select Staff');
        }
        $('.staffArea').hide();
        userRole = $('.selectRole option:selected').text();
        if ($(this).val() == 'Field Work') {
            /*if(TP.is_edit == 0)
            {
                $('.staffArea .selectpicker option:eq(0)').prop('selected', true);
                $('.fieldWorkType').hide();
            }*/
            $('.field-work-day').hide();
            if (userRole == 'RBH' || 'ZBH' || 'BH') {
                $('.field-work').show();
                $('.field-work-area').hide();
                $('.fieldWorkType').show();
                $('.field-work-area-type').show();
                $('#selectFieldWorkType option:eq(0)').prop('selected', true).trigger('change');
                $('.customers').hide(); //Abi
            }
            if ((userRole == 'FLSP')) {
                $('.field-work').show();
                $('.fieldWorkType').hide();
                $('.field-work-day').show();
                $('.selectDay option:eq(0)').prop('selected', true);
                $('.field-work-area-type').show();
            }
        } else {
            $('.field-work').hide();
            $('.selectDay option:eq(0)').prop('selected', true);
            $('.field-work-area-type select').val('Select Area Type');
            $('.customers').hide(); //Abi
        }
        //if selectActivity is MEETING
        if ($(this).val() == 'Meeting') {
            $('.meeting').show();
            $('.selectDay option:eq(0)').prop('selected', true);
            $('#meetingType option:eq(0)').prop('selected', true);
            $('.field-work-area-type select').val('Select Area Type');
        } else {
            $('.meeting').hide();
        }
        //if selectActivity is Office
        if ($(this).val() == 'Office') {
            $('.office').show();
            $('.selectDay option:eq(0)').prop('selected', true);
            $('#office-type option:eq(0)').prop('selected', true);
            $('.field-work-area-type select').val('Select Area Type');
        } else {
            $('.office').hide();
        }
        if ($(this).val() == 'Marketing Activity') {
            $('.marketingTypeContainer').show();
            $('.selectDay option:eq(0)').prop('selected', true);
            $('#marketingType option:eq(0)').prop('selected', true);
            $('.field-work-area-type select').val('Select Area Type');
        } else {
            $('.marketingTypeContainer').hide();
        }
    });
    var selectFieldWorkType = $('#selectFieldWorkType option:selected').text();
    if (selectFieldWorkType == 'With Staff') {
        $('.FlspHq').show();
        $('.flspHq').val("");
        $('.staffName').show();
    }
    if(selectFieldWorkType == 'Independent')
    {
        $('.staffArea').hide();
    }
    if (selectFieldWorkType == 'Distributor Visit') 
    {
        $('.field-work-day').hide();
        $('.field-work-area-type').hide();
        $('.field-work-area').hide();
    }
    $('#selectFieldWorkType').change(function() {
        selectFieldWorkType = $('#selectFieldWorkType option:selected').text();
        if (selectFieldWorkType == 'With Staff') {
            $('.FlspHq').show();
            $('.flspHq').val("");
            $('.staffName').show();
        } else {
            $('.FlspHq').hide();
            $('.staffName').hide();
            $('.staffArea').hide();
        }
        if(selectFieldWorkType == 'Independent')
        {
            $('.staffArea').hide();
        }
        if (selectFieldWorkType == 'Distributor Visit') {
            $('.field-work-day').hide();
            $('.field-work-area-type').hide();
            $('.field-work-area').hide();
            $('.customers').hide(); //Abi   
        }
   });
    $('.selectpicker').change(function() {
        var selected = [];
        $('.selectpicker :selected').each(function() {
            selected.push($(this).text());
        });
        selectedArea = selected.toString();
    });
    //
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
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
    var currentUserEmail = 'testemail';
    /*$(document).ready(function() {*/
        ZOHO.embeddedApp.on("PageLoad", function(data) {
            $()
            setCookie('access_token', '123', '1');
            var Current_Month = $("#calendar").fullCalendar('getDate').getMonth();
            var Current_Year = $("#calendar").fullCalendar('getDate').getFullYear();
            cal.calMonth = Current_Month+1;
            cal.calYear = Current_Year;
            //End Get the Current Month And Year
            //to get current user
            ZOHO.CRM.CONFIG.getCurrentUser().then(function(data) {
                var currentUserName = data.users[0].full_name;
                var currentUserId = data.users[0].id;
                currentUserEmail = data.users[0].email;
                $('#userEmailId').val(currentUserEmail);
                $('#userName').val(currentUserName);
                $('#userId').val(currentUserId);
                TP.logged_User = currentUserId;
                TP.currentUserName = currentUserName;
                  console.log(currentUserEmail);
                  ZOHO.CRM.API.searchRecord({Entity:"Employee_Master",Type:"criteria",Query:"(Email:equals:"+ currentUserEmail + ")"})
                    .then(function(data){
                      console.log('USer Hq');
                      console.log(data);
                      console.log('Hq');
                        var data = data.data[0];
                        var userROle = data.Role;
                        var hqId = data.HQ.id;
                        var hqName = data.HQ.name;
                        $('#userHq').val(hqName);
                        $('#userHqId').val(hqId);
                        $('#userRole').val(userROle);
                        $('.selectRole').val(userROle);
                        TP.userRole = userROle;
                        TP.userHq = hqName;
                        /***********************Abhilash Start***************************/
                        //API to get all users
                        ZOHO.CRM.API.getAllRecords({Entity:"Employee_Master",sort_order:"asc",per_page:100,page:1})
                            .then(function(data) {
                              console.log("user-listentry");
                              console.log(data);
                                var userId = $('#userId').val();
                                var userList = '<option>--Select Users--</option>'
                                $.each(data.data, function(key, val) {
                                    var selected = (userId == val.Owner.id) ? "selected" : "";
                                    userList += '<option value=' + val.Owner.id + ' ' + selected + '>' + val.Owner.name + '</option>';
                                  console.log("user-list");
                                   if(TP.logged_User == val.Owner.id)
                                   {
                                     TP.Selected_User = val.Owner.id;
                                     TP.Selected_UserName = val.Owner.name;

                                   }
                                  console.log("user-list end");
                                });
                                $('#users-list').html(userList);

                                   if($('#userRole').val() != "FLSP")
                                   {
                                       $('#users-list').show();
                                   }
                                   else 
                                   {
                                       $('#users-list').hide();
                                   }
                            })

                        /***********************Abhilash End***************************/
                        TP.setUpCal(TP.logged_User);
                          //    if(TP.status == 'Approved')
                          // {
                          //     $('#calendar').fullCalendar({
                          //                         disableDragging:true,
                          //                       });
                          // }
                        //Naresh start
                          $('#send-approval').click(function() {
                            workingDaysInMonth(cal.calMonth,cal.calYear);
                            if(TP.noOfEventsInAMonth >= TP.noOfWorkingDays)
                            {
                               
                                console.log("TP.noOfEventsInAMonth"+TP.noOfEventsInAMonth);
                                console.log("TP.noOfWorkingDays"+TP.noOfWorkingDays);
                                

                                var Status = "Sent";
                                var message = "";
                                $('#exampleModalCenter .modal-title').html('Alert');
                                $('#exampleModalCenter .modal-body').html('Processing Data For Approval !!');
                                $('#exampleModalCenter').modal('show');
                                TP.updateTpSentStatus(TP.logged_User,Status);
                                console.log(TP.currentUserName,TP.logged_User,Status,message);
                            }
                            else{
                                    $('#exampleModalCenter .modal-title').html('Alert');
                                    $('#exampleModalCenter .modal-body').html("Please complete TP for all days before sending for approval");
                                    $('#exampleModalCenter').modal('show');
                            }

                          });
                        var selectedMonth = $("#calendar").fullCalendar('getDate').getMonth() + 1; 
                        var selectedYear = $("#calendar").fullCalendar('getDate').getFullYear();
                        var monAndYear = selectedMonth+'-'+selectedYear;
                        //API to get planned days
                        //ZOHO.CRM.API.searchRecord({Entity:"TP_CRM",Type:"criteria",Query:"((Owner:equals:80796000000108013) and (TP_Month:equals:12-2019))"}) // for arpit
                        ZOHO.CRM.API.searchRecord({Entity:'TP_CRM',Type:'criteria',Query:'((Owner:equals:'+currentUserId+') and (TP_Month:equals:'+monAndYear+'))'}) 
                        .then(function(data){
                            //console.log(data.data)
                            $.each(data.data, function(key,val){
                                if(val.Activity_Type == 'Field Work')
                                {
                                     $("#day"+val.Day).prop('disabled', true);
                                     console.log('unplanned day'+val.Day);
                                }
                            });
                        })
                    })
            })
            
            //Select worktype
            $('#selectFieldWorkType').change(function() {
                //return;
                //API to get all users if the role is RBH or ZBH or BH
                if (($('#userRole').val() == 'RBH') || ($('#userRole').val() == 'ZBH') || ($('#userRole').val() == 'BH')) {
                    //$('.field-work-area').hide();
                    workType = $('#selectFieldWorkType option:selected').val();
                    //API to get area if independent
                    if (workType == 'With Staff') {
                        $('.field-work-day').hide();
                        $('.field-work-area').hide();
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
                        ZOHO.CRM.API.getAllRecords({Entity:"Employee_Master",sort_order:"asc",per_page:100,page:1})
                        .then(function(data){
                           console.log(data)
                                var allUsers = data.data;
                                var users = '';
                                $.each(allUsers, function(key, val) {
                                    users += "<option value='" + val.Owner.name + "' data-email='" + val.Email + "' ' data-id='" + val.Owner.id + "'>" + val.Owner.name + "</option>";
                                });
                                $('#staff-name').empty();
                                $('#staff-name').append(users);  
                            });
                            console.log("Get All USers");
                    }
                    if (workType == 'Independent') {
                        if($('#edit').val() == 1)
                        {
                            $('.field-work-area').show();

                        }
                        if($('#edit').val() == 0)
                        {
                           $('.selectDay option:eq(0)').prop('selected', true);
                        }
                        $('.field-work-day').show();
                        $('.selectDay option:eq(0)').prop('selected', true);
                        $('.FlspAndIndependent').hide();
                        $('.staffArea').hide();
                    }
                }

            
            });
            //API to get FLSP HQ from selected staff
            $('.staff-name').change(function() {
                workType = $('#selectFieldWorkType option:selected').val();
                if(workType != 'Distributor Visit')
                {
                    $('.field-work-area-type').show();
                }
                if(workType == 'With Staff')
                {
                    $('.field-work-area').hide();
                    $('.staffArea').show();
                }
                if(workType == 'Independent')
                {
                    if($('#edit').val() == 1)
                    {
                        $('.field-work-area').show();
                    }
                    $('.staffArea').hide();
                }
                //$('.field-work-area').hide();
                //API to get area based on staff
                var selectedDate = $('#datetimepicker').val();
                var staffId = $('.staff-name option:selected').attr('data-id');
                ZOHO.CRM.API.searchRecord({
                        Entity: 'TP_CRM',
                        Type: 'criteria',
                        Query: '((Date:equals:' + selectedDate + ')and(Owner:equals:' + staffId + '))'
                    })
                    .then(function(data) {
                    console.log('all data for staff areass');
                    console.log(data);
                    var staffAreas = '';
                    console.log('value of edit'+ TP.is_edit);
                    if(workType == 'With Staff')
                    {
                        if (TP.checkAreaChange == 1) 
                        {
                            console.log('areasPreSelectedArray in staff');
                            console.log(areasPreSelectedArray);
                            $.each(areasPreSelectedArray, function(key,val){
                                staffAreas += '<option selected="selected" >' + val + '</option>';
                            });
                            TP.checkAreaChange = 0;
                        }
                        else
                        {
                            var checkIfAreas = '';
                            if(data.status)
                            {
                                console.log('status from API to get staff areas => '+data.status);
                                if(data.status == 204)
                                {
                                    $('#exampleModalCenter .modal-title').html('Alert');
                                    $('#exampleModalCenter .modal-body').html("The selected staff does not have field planned for the day!");
                                    $('#exampleModalCenter').modal('show');
                                    $(".staffArea .selectpicker").val(null);
                                    $('#staffAreaSelect').attr('disabled',true);
                                    $('#staffAreaSelect').selectpicker('refresh');
                                    $('.submit').prop('disabled', true);
                                }
                            }
                            else
                            {
                                var data = data.data[0].Areas;
                                if(data == null)
                                {
                                    $('#exampleModalCenter .modal-title').html('Alert');
                                    $('#exampleModalCenter .modal-body').html("The selected staff does not have field planned for the day!");
                                    $('#exampleModalCenter').modal('show');
                                    $(".staffArea .selectpicker").val(null);
                                    $('#staffAreaSelect').attr('disabled',true);
                                    $('#staffAreaSelect').selectpicker('refresh');
                                    $('.submit').prop('disabled', true);
                                }
                                else
                                {
                                    //show areas here
                                    $('#areas').val(data);
                                    var staffAreasArray = null;
                                    if(data)
                                        staffAreasArray = data.split(',');
                                    staffAreas += '<option disabled="disabledd">Areas</option>';
                                    $.each(staffAreasArray, function(key, val) {
                                        staffAreas += '<option selected="selected" >' + val + '</option>';
                                    });
                                    $('#staffAreaSelect').attr('disabled',false);
                                    $('#staffAreaSelect').selectpicker('refresh');
                                    $('.submit').prop('disabled', false);
                                }
                            }
                        }
                        $('#staffAreaSelect').empty();
                        $('#staffAreaSelect').html(staffAreas);
                    }

                    });
                //API to get area type 
                var selected = [];
                $('.areaSelector :selected').each(function() {
                    selected.push($(this).text());
                });
                selectedArea = selected.toString();
                var staffEmail = $('.staff-name option:selected').attr('data-email');
                ZOHO.CRM.API.searchRecord({Entity:"Employee_Master",Type:"criteria",Query:"(Email:equals:"+ staffEmail + ")"})
                .then(function(data){
                        console.log('data after staff email');
                        console.log(data);
                        var userROle = data.data;
                        $('.flspHq').val(userROle[0].HQ.name);
                        $('.flspHqId').val(userROle[0].HQ.id);
                        //API to get area type 
                        var staffAreaSelected = [];
                        $('#staffAreaSelect :selected').each(function() {
                            staffAreaSelected.push($(this).text());
                        });
                       console.log("widget_connection");
                        selectedArea = staffAreaSelected.toString();
                        console.log(selectedArea);
                        $('#staffHqId').val(userROle[0].HQ.id);
                        var userHQID = userROle[0].HQ.id;
                        ZOHO.CRM.API.searchRecord({Entity:"Area_Type_Master",Type:"criteria",Query:'(HQ:equals:'+userHQID+')'})
                    .then(function(data){
                          console.log('the below reponse will give other areas for RBH with staff');
                          console.log(data)
                          var checkDuplicates = selectedArea.split(",");
                          console.log(checkDuplicates);
                          var otherAreas = '';
                          $.each(data.data, function(key, val) {
                              otherAreas += '<option>' + val.Name + '</option>';
                          });
                          if(workType == 'With Staff')
                          {
                              $('#staffAreaSelect').append(otherAreas);
                              $('.staffArea .selectpicker').selectpicker('refresh');
                          }
                    })
                        //API to get area type 
                        var selected = [];
                        $('#staffAreaSelect :selected').each(function() {
                            selected.push($(this).text());
                        });
                        selectedArea = selected.toString();
                          var config = {
                                       "select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + userROle[0].HQ.id + "'"
                                      }
                        ZOHO.CRM.API.coql(config).then(function(data)
                        {
                          console.log(data);
                            if(data.statusText == "nocontent")
                            {
                                $('.field-work-area-type select').val('OS');
                            }
                            else
                            {
                                var areaType = data.data;
                                var areaTypeDp = [];
                                $.each(areaType, function(key, val) {
                                    if (val.Area_Type == 'EX HQ') {
                                        areaTypeDp.push('EX-HQ');
                                    } else {
                                        areaTypeDp.push(val.Area_Type);
                                    }
                                });
                                if ($.inArray("OS", areaTypeDp) !== -1) {
                                    $('.field-work-area-type select').val('OS');
                                } else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
                                    $('.field-work-area-type select').val('EX-HQ');
                                } else {
                                    $('.field-work-area-type select').val('HQ');
                                }
                            }
                        })
                    })
                //----Staff area ends

            });
            //API to get area type on document click
            $('.staffArea .selectpicker').on('hide.bs.select', function () {
                var userHqId = $('#userHqId').val();  
                var staffHqId = $('#staffHqId').val();
                var selected = [];
                $('#staffAreaSelect :selected').each(function() {
                    selected.push($(this).text());
                });
                selectedArea = selected.toString();
                console.log('selectedArea bfr');
                console.log(selectedArea);
                if(selectedArea)
                {
                    var config = {
                                 "select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + staffHqId + "'"
                                }
                    console.log(config);
                    ZOHO.CRM.API.coql(config).then(function(data)
                    {
                      console.log("coqlActivityType inner1");
                      console.log(data);
                            if(data.statusText == "nocontent")
                            {
                                $('.field-work-area-type select').val('OS');
                            }
                            else
                            {
                                var areaType = data.data;
                                var areaTypeDp = [];
                                $.each(areaType, function(key, val) {
                                    if (val.Area_Type == 'EX HQ') {
                                        areaTypeDp.push('EX-HQ');
                                    } 
                                    else {
                                        areaTypeDp.push(val.Area_Type);
                                    }
                                });
                                if ($.inArray("OS", areaTypeDp) !== -1) {
                                    $('.field-work-area-type select').val('OS');
                                } else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
                                    $('.field-work-area-type select').val('EX-HQ');
                                } else {
                                    $('.field-work-area-type select').val('HQ');
                                }
                            }
                        });
                }    
            });
            //Api to get area
            var selectedDay = '';
                $('.selectDay').change(function() {
                    var selectRole = $('.selectRole').val();
                    if($('#selectFieldWorkType option:selected').val() != 'Distributor Visit')
                    {
                        $('.field-work-area').show();
                    }
                    selectedDay = $('.selectDay option:selected').text();
                    var userHqId = $('#userHqId').val();
                    console.log('userHqId'+userHqId);
                    var currUsrId = $('#userId').val();
                    console.log('currUsrId'+currUsrId);
                    var userSelectedYear = $('#userSelectedYear').val();
                    console.log('userSelectedYear'+userSelectedYear);
                    ZOHO.CRM.API.searchRecord({Entity:"STP_CRM",Type:"criteria",Query:"((Year:equals:"+ userSelectedYear + ")and(Owner:equals:"+ currUsrId +")and(Day:equals:"+ selectedDay + "))"})
                          .then(function(data){
                             console.log('areas on select of day');
                              console.log(data)
                            var selectedAreas = '';
                            console.log('areas on select of day');
                            console.log(data);
                            if (TP.checkAreaChange == 1) 
                            {
                                if($('#userRole').val() == 'FLSP')
                                {
                                    $.each(areasPreSelectedArray, function(key,val){
                                        selectedAreas += '<option selected="selected" >' + val + '</option>';
                                    });
                                    TP.checkAreaChange = 0;
                                }
                                if($('#selectFieldWorkType option:selected').val() == 'Independent')
                                {
                                    $.each(areasPreSelectedArray, function(key,val){
                                        selectedAreas += '<option selected="selected" >' + val + '</option>';
                                    });
                                    TP.checkAreaChange = 0;
                                }
                            }
                            else
                            {
                                var areas = data.data[0].Areas_Planned;
                                $('#areas').val(areas);
                                var areasArray = areas.split(',');
                                $.each(areasArray, function(key, val) {
                                    selectedAreas += '<option selected="selected" >' + val + '</option>';
                                });
                            }
                            $('select.areaSelector').empty();
                            $('select.areaSelector').html(selectedAreas);
                            $('.selectpicker').selectpicker('refresh')

                            //API COQL to get other areas
                            var selected = [];
                            $('.areaSelector :selected').each(function() {
                                //alert('.areaSelector selected');
                                selected.push($(this).text());
                            });
                            selectedArea = selected.toString();
                            console.log('before getting all areas');
                            ZOHO.CRM.API.searchRecord({Entity:"Area_Type_Master",Type:"criteria",Query:'(HQ:equals:'+userHqId+')'})
                                .then(function(data){
                                    console.log(data)
                                console.log('to get other areas in FLSP and INdependent');
                                console.log(data);
                                var otherAreas = ''
                                //var checkDuplicates = selectedArea.split(",");
                                console.log('checkDuplicates');
                                console.log(selectedArea);
                                $.each(data.data, function(key, val) {
                                    console.log(val.Name);
                                    if(!(selectedArea.includes(val.Name)))
                                    {
                                        otherAreas += '<option>' + val.Name + '</option>';
                                    }
                                });
                                $('select.areaSelector').append(otherAreas);
                                $('.selectpicker').selectpicker('refresh');
                                })
                            //API to get area type 
                            var selected = [];
                            $('.areaSelector :selected').each(function() {
                                selected.push($(this).text());
                            });
                            selectedArea = selected.toString();
                            var config = {
                                           "select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + userHqId + "'"
                                          }
                            ZOHO.CRM.API.coql(config).then(function(data)
                            {
                              console.log(data);
                              var areaType = data.data;
                              var areaTypeDp = [];
                              console.log('data of area type');
                              console.log(data);
                              if(data.statusText == "nocontent")
                              {
                                  console.log('in data.details.statusMessage');
                                  $('.field-work-area-type select').val('OS');
                              }
                              else
                              {
                                  $.each(areaType, function(key, val) {
                                      if (val.Area_Type == 'EX HQ') {
                                          areaTypeDp.push('EX-HQ');
                                      } else {
                                          areaTypeDp.push(val.Area_Type);
                                      }
                                  });
                                  if ($.inArray("OS", areaTypeDp) !== -1) {
                                      $('.field-work-area-type select').val('OS');
                                  } else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
                                      $('.field-work-area-type select').val('EX-HQ');
                                  } else {
                                      $('.field-work-area-type select').val('HQ');
                                  }
                              }
                            })
                            //API to get area type on changed
                        })
                });
            //API to get area type on document click
            $('.FlspAndIndependent .selectpicker').on('hide.bs.select', function () {
                var selected = [];
                var userHqId = $('#userHqId').val();
                $('.areaSelector :selected').each(function() {
                    selected.push($(this).text());
                });
                selectedArea = selected.toString();
                console.log('selectedArea');
                console.log(selectedArea);
                if(selectedArea)
                {
                  console.log("coqlActivityType3");
                  var config = {
                               "select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + userHqId + "'"
                              }
                    ZOHO.CRM.API.coql(config).then(function(data)
                    {
                      console.log("coqlActivityType inner3");
                      console.log(data);
                            console.log('area type from response');
                            console.log(data);
                          if(data.statusText == "nocontent")
                            {
                                $('.field-work-area-type select').val('OS');
                            }
                            else
                            {
                                var areaType = data.data;
                                var areaTypeDp = [];
                                $.each(areaType, function(key, val) {
                                    if (val.Area_Type == 'EX HQ') {
                                        areaTypeDp.push('EX-HQ');
                                    } else {
                                        areaTypeDp.push(val.Area_Type);
                                    }
                                });
                                if ($.inArray("OS", areaTypeDp) !== -1) {
                                    $('.field-work-area-type select').val('OS');
                                } else if ($.inArray("EX-HQ", areaTypeDp) !== -1) {
                                    $('.field-work-area-type select').val('EX-HQ');
                                } else {
                                    $('.field-work-area-type select').val('HQ');
                                }
                            }
                    })
                }
            })
            $('#calendar').fullCalendar('next|prev');
            $('#check').click(function(e) {
                e.preventDefault();
                var Marketing_Activity_Type = $('#marketingType option:selected').val();
                $('#checking').append(Marketing_Activity_Type);
            });

            $('.submit').click(function(e) {
                e.preventDefault();
                var Area_Type = '';
                var Areas = '';
                var Activity_Type = $('#selectActivity option:selected').val();
                console.log('Marketing_Activity_Type => '+Marketing_Activity_Type);
                var datetime = $('#datetimepicker').val();
                var Day = '';
                var HQ = $('#userHq').val();
                var Role = $('.selectRole').val();
                var Fieldwork_Type = $('#selectFieldWorkType option:selected').text();
                var Staff_Name = $('#staff-name option:selected').text();
                if(Activity_Type == 'Select Activity')
                {
                    $('#exampleModalCenter .modal-title').html('Alert');
                    $('#exampleModalCenter .modal-body').html("Please select valid Activity Type");
                    $('#exampleModalCenter').modal('show');
                    e.preventDefault();
                    return;
                }
                var Marketing_Activity_Type = $('#marketingType option:selected').val();
                if(Activity_Type == 'Marketing Activity')
                {
                    if((Marketing_Activity_Type == null) || (Marketing_Activity_Type == undefined) || (Marketing_Activity_Type == 'Select Marketing Type'))
                    {
                        $('#exampleModalCenter .modal-title').html('Alert');
                        $('#exampleModalCenter .modal-body').html("Please select valid marketing activity type");
                        $('#exampleModalCenter').modal('show');
                        e.preventDefault();
                        return;
                    }
                }
                if(Activity_Type != 'Marketing Activity')
                {
                    Marketing_Activity_Type = '';
                }
                if(Activity_Type == 'Field Work')
                {
                    if (Role == 'FLSP') 
                    {
                        var selectedAreas = $(".FlspAndIndependent .selectpicker").val();
                        Areas = selectedAreas.join(",");
                        Day = $('.selectDay option:selected').text();
                        console.log('Day in FLSP'+Day);
                    } 
                    else 
                    {
                        if(Fieldwork_Type == 'Select Field Work Type')
                        {
                            $('#exampleModalCenter .modal-title').html('Alert');
                            $('#exampleModalCenter .modal-body').html("Please select valid field work type");
                            $('#exampleModalCenter').modal('show');
                            e.preventDefault();
                            return;   
                        }
                        if(Fieldwork_Type == 'With Staff')
                        {
                            if(Staff_Name == 'Select Staff')
                            {
                                $('#exampleModalCenter .modal-title').html('Alert');
                                $('#exampleModalCenter .modal-body').html("Please select staff");
                                $('#exampleModalCenter').modal('show');
                                e.preventDefault();
                                return; 
                            }
                        }
                        console.log('day val bfr');
                        console.log($('.selectDay').val());
                        if(Fieldwork_Type == 'Independent')
                        {
                            console.log('Fieldwork_Type is Independent');
                            var selectedAreas = $('.FlspAndIndependent .selectpicker').val();
                            Areas = selectedAreas.join(",");
                            Day = $('.selectDay option:selected').text();
                            console.log('Day in Independent'+Day);
                            if(Day == 'Select Day')
                            {
                                $('#exampleModalCenter .modal-title').html('Alert');
                                $('#exampleModalCenter .modal-body').html("Please select Day");
                                $('#exampleModalCenter').modal('show');
                                e.preventDefault();
                                return;
                            }
                        }
                        else
                        {
                            var selectedAreas = $(".staffArea .selectpicker").val();
                            Areas = selectedAreas.join(",");
                        }
                    }
                    if(Fieldwork_Type == 'Distributor Visit')
                    {
                        Area_Type = '';
                        Areas = '';
                        Day = '';
                    }
                    else
                    {
                        Area_Type = $('#area_type').val();
                    }
                    if(Role != 'FLSP')
                    {
                        if(Day == 'Select Day')
                        {
                            $('#exampleModalCenter .modal-title').html('Alert');
                            $('#exampleModalCenter .modal-body').html("Please select Day");
                            $('#exampleModalCenter').modal('show');
                            e.preventDefault();
                            return;
                        }
                    }
                    //Return if no areas for selected user
                    if((Fieldwork_Type == 'Independent') || (Fieldwork_Type == 'With Staff'))
                    {
                        if((Areas == null) || Areas == '')
                        {
                            //alert('The selected staff does not have field planned for the day.');
                            $('#exampleModalCenter .modal-title').html('Alert');
                            $('#exampleModalCenter .modal-body').html("The selected staff does not have field planned for the day");
                            $('#exampleModalCenter').modal('show');
                            e.preventDefault();
                            return;
                        }
                    }
                }
                else
                {
                    Field_work_Type = '';
                }
                console.log('day value'+Day);
                var Name = '';
                if(Areas != null)
                {
                    Name = Activity_Type +' - '+ Areas;
                }
                var userName = $('.userName').val();
                var Fieldwork_Type = $('#selectFieldWorkType option:selected').text();
                var FLSP_HQ = $('#fisp-hq').val();
                var Office_Type = $('#office-type').val();
                console.log('Office_Type => '+Office_Type);
                if(Activity_Type == 'Office')
                {
                    if((Office_Type == null) || (Office_Type == undefined) || (Office_Type == 'Select Office Type'))
                    {
                        $('#exampleModalCenter .modal-title').html('Alert');
                        $('#exampleModalCenter .modal-body').html('Please select valid office type');
                        $('#exampleModalCenter').modal('show');
                        e.preventDefault();
                        return;
                    }
                }
                var Staff_Id = $('.staff-name option:selected').attr('data-id');
                var MeetingType = $('#meetingType').val();
                console.log('MeetingType => '+MeetingType);
                if(Activity_Type == 'Meeting')
                {
                    if((MeetingType == null) || (MeetingType == undefined) || (MeetingType == 'Select Meeting Type'))
                    {
                        $('#exampleModalCenter .modal-title').html('Alert');
                        $('#exampleModalCenter .modal-body').html('Please select valid meeting type');
                        $('#exampleModalCenter').modal('show');
                        e.preventDefault();
                        return;
                    }
                }
                if(!Staff_Name || !Staff_Id)
                    Staff_Name = null;
                else
                {
                     Staff_Name = {
                        "name": Staff_Name,
                        "id"  : Staff_Id
                    }
                }
                var userId = $('#userId').val();
                e.preventDefault();
                    //Inset TP
                    if (TP.is_edit == 0) {
                        var recordData = {
                                            "Activity_Type": Activity_Type,
                                            "Approval_Status": "Draft",
                                            "Area_Type": Activity_Type,
                                            "Areas": Areas,
                                            "Date": datetime,
                                            "Day": Day,
                                            "Fieldwork_Type": Fieldwork_Type,
                                            'Marketing_Activity_Type': Marketing_Activity_Type,
                                            "FLSP_HQ": FLSP_HQ,
                                            "HQ": HQ,
                                            "MeetingType" : MeetingType,
                                            "Office_Type": Office_Type,
                                            "Role": Role,
                                            "Staff_Name": Staff_Name,
                                            "Name": Name,
                                            "Owner": {
                                                "name": userName,
                                                "id": userId
                                                    }
                                          }
                      console.log("insert event");
                      console.log(TP);
                      console.log(recordData);
                      console.log("insert event end");

                    ZOHO.CRM.API.insertRecord({Entity:"TP_CRM",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                            console.log(data);
                            var sucess_details={};
                            var eventid = data.data[0].details.id;
                            var eventObj = {
                                title: Name,
                                start: datetime,
                                event_id: eventid,
                                color: "gray",
                                textColor: "#fff"
                            };
                            setupEventAndRedirectCal(eventObj);
                            TP.status = 'Draft';
                            TP.noOfEventsInAMonth = TP.noOfEventsInAMonth + 1;
                            $("#cancel").click();
                            });
                    } 
                    else 
                    {
                        console.log("submit"+TP.Status);
                        var config = {
                            Entity: "TP_CRM",
                            APIData: {
                                "id": $("#selectedEventId").val(),
                                "Activity_Type": Activity_Type,
                                "Approval_Status": "Draft",
                                "Area_Type": Area_Type,
                                "Areas": Areas,
                                "Date": datetime,
                                "Day": Day,
                                "Fieldwork_Type": Fieldwork_Type,
                                'Marketing_Activity_Type': Marketing_Activity_Type,
                                "FLSP_HQ": FLSP_HQ,
                                "HQ": HQ,
                                "MeetingType" : MeetingType,
                                "Office_Type": Office_Type,
                                "Role": Role,
                                "Staff_Name": Staff_Name,
                                "Name": Name,
                                "Owner": {
                                    "name": userName,
                                    "id": userId
                                }
                            }
                        }
                        ZOHO.CRM.API.updateRecord(config)
                            .then(function(data) {
                                var eventid = $("#selectedEventId").val();
                                var eventObj = {
                                    title: Name,
                                    start: datetime,
                                    event_id: eventid,
                                    color: "gray",
                                    textColor: "#fff"
                                };
                                setupEventAndRedirectCal(eventObj);
                                TP.status = 'Draft';
                                console.log(data);
                            });
                }
                $('#formScreen').hide();
                $('#wrap').show();
                $( '#newsletterform' ).each(function(){ this.reset(); });
            });
        });
        ZOHO.embeddedApp.init();
});