function status_change(Status){
        console.log(Status);

    if(Status == 'Approved')
    {
      console.log(Status);
      $.confirm(
      {
          title: Status,
          // content : 'If You Want To'+Status+'TP',
          buttons: {
              confirm: function () {
                  // $.alert('Confirmed!');
                   // TP.updateTpStatus(UserId,Status);
                    TP.updateTpStatus(TP.Selected_UserName,TP.Selected_User,Status,'');
                    console.log(TP.Selected_UserName,TP.Selected_User,Status);
                    $('#approve').hide();
              },
              cancel: function () {
                  // $.alert('Canceled!');
                  // TP.updateTpStatus(UserId,Status);
              },
          }
      });
    }
    else{
      $.confirm({
    content: '' +
    '<form action="" class="formName">' +
    '<div class="form-group">' +
    '<label>Enter Reason For Rejection</label>' +
    '<input type="text" placeholder="" class="name form-control" id="reason" required />' +
    '</div>' +
    '</form>',
    buttons: {
        formSubmit: {
            text: 'confirm',
            btnClass: 'btn btn-blue',
            action: function () {
                var message = this.$content.find('.name').val();
                if(!message){
                    $.alert('provide a valid name');
                    return false;
                }
                // $.alert('Confirmed!');
                TP.updateTpStatus(TP.Selected_UserName,TP.Selected_User,Status,message);
                    console.log(TP.Selected_UserName,TP.Selected_User,Status,message);
                    $('#approve').hide();
            }
        },
        cancel: function () {
            // $.alert('Canceled!');
        },
    },
    onContentReady: function () {
        // bind to events
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger('click'); // reference the button and click it
        });
    }
});
    }
}

function setupEventAndRedirectCal(eventObj)
{

   if (TP.noOfEventsInAMonth >= 1) {
       sendApprovalUpdate(1, "Send for approval");
       $("#send-approval").attr('disabled', false);
   }
   if (TP.is_edit == 0){
       $('#calendar').fullCalendar('renderEvent', eventObj, true);
   }
   else{
       calendarEventClickedObj.title = eventObj.title;
       calendarEventClickedObj.start = eventObj.start;
       calendarEventClickedObj.color = eventObj.color;
       $('#calendar').fullCalendar('updateEvent', calendarEventClickedObj);
   }
       //$("#cancel").click();
}
//this comment is test git
function sendApprovalUpdate(status, message) {
    $("#send-approval").html(message);
    if (status)
        $("#send-approval").show();
    else
        $("#send-approval").hide();
}
function workingDaysInMonth (month, year) {
    var dayinamonth = new Date(year, month, 0).getDate();
    var date = new Date();
    var count = 0;
    for (var i = 1 ;i<= dayinamonth;i++ )
    {
        var dow = new Date(year+'-'+month+'-'+i).getDay();
        if(dow === 0)
        {
            count = count + 1;
        }
    }
    var noOfWorkingDays = dayinamonth - count;
    TP.noOfWorkingDays = noOfWorkingDays;
    return noOfWorkingDays;
}
function deleteEvent(event_id){
      $.confirm(
      {
          title: "",
          // content : 'If You Want To'+Status+'TP',
          buttons: {
              confirm: function () {
                  // $.alert('Confirmed!');
                   // TP.updateTpStatus(UserId,Status);
                          ZOHO.CRM.API.deleteRecord({Entity:"TP_CRM",RecordID: event_id})
                          .then(function(data){
                          console.log(data)
                         // $('#calendar').fullCalendar('removeEvent',event_id);
                         TP.setUpCal(TP.logged_User);
                        })
                          // TP.setUpCal(TP.logged_User);
                         // $('#calendar').fullCalendar('removeEvent',event_id);
                         //  $('#calendar').fullCalendar('rerenderEvent',event_id);
                         $("#cancel").click();
              },
              cancel: function () {
                  // $.alert('Canceled!');
              },
          }
      });
    }
function coqlAPI(query)
{
  var res = '';
  console.log('coql Entry');
  var config = {
     "select_query": query
    }
    console.log(config);
  ZOHO.CRM.API.coql(config).then(function(data){
   //console.log(data);
     console.log('coql inside');
     console.log(data);
     res = data;
     console.log("res");
     console.log(res);
  });
    console.log('coql Entryend ');
    return res;

}
