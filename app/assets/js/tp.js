TP.updateTpStatus = function(UserName,UserId,Status,message) 
{
  var curr_date = new Date();
  TP.status = Status;
  var current_date = cal.calMonth + '-' + cal.calYear;
  console.log("TP_Month"+current_date);
  console.log("Approval_Status"+Status);
  console.log('id'+UserId);
  console.log('CurrentUserName'+UserName);
  if(Status == 'Rejected'){
    TP.reject_reason = message;
    console.log(TP.reject_reason);
    var recordData = {
         "TP_Month": current_date,
         "Approval_Status": Status, "Rejection_Reason":message,
         "Owner":{
         "name": UserName,
         "id":UserId
         }
       }
     }
     else{
       var recordData = {
         "TP_Month": current_date,
         "Approval_Status": Status,
         "Owner":{
         "name": UserName,
         "id":UserId
         }
       }
     }
   ZOHO.CRM.API.insertRecord({Entity:"TP_Approvals",APIData:recordData,Trigger:["workflow"]}).then(function(data)
    {
      console.log(data);
      if(Status == 'Sent')
        {
            sendApprovalUpdate(1, "Sent for approval");
            $("#send-approval").attr('disabled', true);
            $('#delete').show();
            $('.fc-event-inner').css('background','orange');
        }
        if(Status == 'Approved'){
            $('.fc-event-inner').css('background','green');
            $('#delete').hide();
        }
        if(Status == 'Rejected'){
            $('.fc-event-inner').css('background','red');
            $('#delete').show();
            sendApprovalUpdate(0, "TP Rejected");
        }
    });
}
TP.setUpCal = function(UserId) {
    $('#calendar').fullCalendar('removeEvents');
    //Api to get events wrt user
    console.log("setUpCal");
    var logged_User = TP.logged_User;
    var curr_date = new Date();
    var current_date = cal.calMonth + '-' + cal.calYear;
    var currUsrId = UserId;
    ZOHO.CRM.API.searchRecord({
            Entity: "TP_CRM",
            Type: "criteria",
            Query: "((TP_Month:equals:" + current_date + ")and(Owner:equals:" + currUsrId + "))"
        })
        .then(function(data) {
          console.log("Data"+data);
                if(data.statusText == 'nocontent')
                {
                  console.log("nocontent");
                  TP.noOfEventsInAMonth = 0;
                  TP.status = 'Draft';
                  console.log(TP.status);
                }
                else{
                  var noOfEventsInAMonth = data.data.length;
                  TP.noOfEventsInAMonth = noOfEventsInAMonth;
                }
                console.log(TP.noOfEventsInAMonth);
                $.each(data.data, function(key, val) {
                if(key==0){
                    TP.status = val.Approval_Status;
                }
                TP.status = val.Approval_Status;
                console.log("setUpCal Status"+TP.status)
                if (val.Areas == null) {
                    val.Areas = '';
                }
                var title_data = val.Activity_Type + " " + val.Areas;
                console.log("setUpCal LOGGEDIN USER"+logged_User);
                console.log("setUpCal CURRENT USER"+currUsrId);
                if (logged_User == currUsrId) 
                {
                  console.log("enter RBH");
                    if (TP.status  == "Draft") {
                        sendApprovalUpdate(1, "Send For Approval");
                        $("#send-approval").attr('disabled', false);
                        $('#approve').hide();
                        $('#delete').show();
                    }
                    if (TP.status  == "Sent") {
                        sendApprovalUpdate(1, "Sent for approval");
                        $("#send-approval").attr('disabled', true);
                        $('#approve').hide();
                        $('#delete').hide();

                    }
                    if (TP.status  == "Approved") {
                        sendApprovalUpdate(1, "TP Approved");
                        $("#send-approval").attr('disabled', true);
                        $('#approve').hide();
                        $('#delete').hide();

                    }
                     if (TP.status  == "Rejected") {
                        sendApprovalUpdate(1, "TP Rejected");
                        $('#delete').show();
                        $("#send-approval").attr('disabled', true);
                        $('#approve').hide();

                    }
                }
                else {
                    console.log("enter FLSP");
                    if (TP.status == "Draft" && logged_User != currUsrId) {
                        $('#approve').hide();
                        sendApprovalUpdate(0, "Send For Approval");
                        $('#delete').show();
                    }
                    if (TP.status == "Sent" && logged_User != currUsrId) {
                        $('#approve').show();
                        sendApprovalUpdate(0, "Sent For Approval");
                        $('#delete').hide();
                    }
                    if (TP.status == "Approved" && logged_User != currUsrId) {
                        $('#approve').hide();
                        sendApprovalUpdate(0, "Send For Approval");
                        $('#delete').hide();
                    }
                    if (val.Approval_Status == "Rejected" && logged_User != currUsrId) {
                        $('#approve').show();
                        sendApprovalUpdate(1, "TP Rejected");
                        $('#delete').show();
                    }  
                }
   /*if(val.SJP_ID !== null)
                 {
                    var eventObj = 
                    {
                        title: title_data,
                        start: val.Date,
                        event_id: val.id,
                        color: "green",
                        textColor: "#fff"
                    };
                    $('#calendar').fullCalendar('renderEvent', eventObj, true);   
                 }
                 else
                    {*/
                        if(TP.status == 'Draft')
                        {
                            var eventObj = 
                               {
                                   title: title_data,
                                   start: val.Date,
                                   event_id: val.id,
                                   color: "gray",
                                   textColor: "#fff"
                               };
                        }
                        if(TP.status == 'Sent')
                        {
                            var eventObj = 
                               {
                                   title: title_data,
                                   start: val.Date,
                                   event_id: val.id,
                                   color: "orange",
                                   textColor: "#fff"
                               };
                        }
                          if(TP.status == 'Approved')
                        {
                            var eventObj = 
                               {
                                   title: title_data,
                                   start: val.Date,
                                   event_id: val.id,
                                   color: "green",
                                   textColor: "#fff"
                               };
                        }
                            console.log('status is' +val.Date);

                        if(val.Approval_Status == 'Rejected')
                        {
                          var eventObj = 
                               {
                                   title: title_data,
                                   start: val.Date,
                                   event_id: val.id,
                                   color: "red",
                                   textColor: "#fff"
                               };
                        }
                        $('#calendar').fullCalendar('renderEvent', eventObj, true);
                   /*}*/

                   $('#cancel').click();
                   $('.field-work-day').hide();
                   $('.staffName').hide();
                   var emptyVal = '';
                   $('.FlspHq').val(emptyVal);
                   $('.FlspHq').hide();

            });
        })
                          
}
TP.updateTpSentStatus = function(UserId, Status)
{
  TP.status = Status;
  var current_date = cal.calMonth + '-' + cal.calYear;
  ZOHO.CRM.API.searchRecord({
        Entity: "TP_CRM",
        Type: "criteria",
        Query: "((TP_Month:equals:" + current_date + ")and(Owner:equals:" + UserId + "))"
    }).then(function(data) {
        $.each(data.data, function(key, val) {
            var event_id = val.id;
            var config = {
                Entity: "TP_CRM",
                APIData: {
                    "id": event_id,
                    "Approval_Status": Status,
                }
            }
            ZOHO.CRM.API.updateRecord(config)
                .then(function(data) {
                    sendApprovalUpdate(1, "Sent for approval");
                    $("#send-approval").attr('disabled', true);
                    if(Status == 'Sent')
                        $('.fc-event-inner').css('background','#FFBF00');
                    if(Status == 'Approved')
                        $('.fc-event-inner').css('background','#00ff00');
               })
        });
    })
}
