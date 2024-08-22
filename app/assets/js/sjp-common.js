/*------------------Approve or Reject Alert Box START-----------------------*/
function status_change(Status){
        console.log(Status);

    if(Status == 'Approved')
    {
      console.log(Status);
      $.confirm(
      {
          title: Status,
          buttons: {
              confirm: function () {
                    SJP.updateTpStatus(SJP.Selected_UserName,SJP.Selected_User,Status,'');
                    console.log(SJP.Selected_UserName,SJP.Selected_User,Status);
                    $('#approve').hide();
              },
              cancel: function () {
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
                SJP.updateTpStatus(SJP.Selected_UserName,SJP.Selected_User,Status,message);
                    console.log(SJP.Selected_UserName,SJP.Selected_User,Status,message);
                    $('#approve').hide();
            }
        },
        cancel: function () {
        },
    },
    onContentReady: function () {
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
            e.preventDefault();
            jc.$$formSubmit.trigger('click');
        });
    }
});
    }
}
/*------------------Approve or Reject END-----------------------*/
/*------------------Insert Event Render START-------------------*/
function setupEventAndRedirectCal(eventObj)
{

   if (SJP.noOfEventsInAMonth >= 1) {
       sendApprovalUpdate(1, "Send for approval");
       $("#send-approval").attr('disabled', false);
   }
   if (SJP.is_edit == 0){
       $('#calendar').fullCalendar('renderEvent', eventObj, true);
   }
   else{
       calendarEventClickedObj.title = eventObj.title;
       calendarEventClickedObj.start = eventObj.start;
       calendarEventClickedObj.color = eventObj.color;
       $('#calendar').fullCalendar('updateEvent', calendarEventClickedObj);
   }
}
/*------------------Insert Event Render END-------------------*/
/*------------------Send For Approval Button  START-------------------*/

function sendApprovalUpdate(status, message) {
    $("#send-approval").html(message);
    if (status)
        $("#send-approval").show();
    else
        $("#send-approval").hide();
}
/*------------------Send For Approval Button  END------------------*/
/*------------------Check No Of Events Per Month  START------------------*/
// function workingDaysInMonth (month, year) {
//     var dayinamonth = new Date(year, month, 0).getDate();
//     var date = new Date();
//     var count = 0;
//     for (var i = 1 ;i<= dayinamonth;i++ )
//     {
//         var dow = new Date(year+'-'+month+'-'+i).getDay();
//         if(dow === 0)
//         {
//             count = count + 1;
//         }
//     }
//     var noOfWorkingDays = dayinamonth - count;
//     SJP.noOfWorkingDays = noOfWorkingDays;
//     return noOfWorkingDays;
// }
 function workingDaysInMonth (month, year) {
    console.log("workingDaysInMonth running");
    var dayinamonth = new Date(year, month, 0).getDate();
    var date = new Date();
    var count = 0;
    for (var i = 1 ;i<= dayinamonth;i++ )
    {  
      function parseDate(datestring) {
      var d = datestring.split(/\D+/g).map(function(v) { return parseInt(v, 10); });
        return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
      }
      var dateString = year+'/'+month+'/'+i + " " +"00:00:00";
      var daysOfWeek = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
      var whichDay = daysOfWeek[parseDate(dateString).getDay()];
    //   if(whichDay == "Sunday")
    //     {
    //         count = count + 1;
    //     }
    }
    var noOfWorkingDays = dayinamonth - count;
    SJP.noOfWorkingDays = noOfWorkingDays;
    console.log("noOfWorkingDays updated :" + noOfWorkingDays);
    return noOfWorkingDays;
} 

console.log("Date Modification");
//Date Alert
function parseDate(datestring) {
  var d = datestring.split(/\D+/g).map(function(v) { return parseInt(v, 10); });
  return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
}
var dateString = "2013-01-24 00:00:00";
var daysOfWeek = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
var whichDay = daysOfWeek[parseDate(dateString).getDay()];
console.log(whichDay);
console.log("Date Modification");


/*------------------Check No Of Events Per Month  END------------------*/
/*------------------DELETE Event START------------------*/
function deleteEvent(event_id){
      $.confirm(
      {
          title: "",
          buttons: {
              confirm: function () {
                          ZOHO.CRM.API.deleteRecord({Entity:"SJP_CRM",RecordID: event_id})
                          .then(function(data){
                          console.log(data)
                         SJP.setUpCal(SJP.logged_User);
                        })
                         $("#cancel").click();
              },
              cancel: function () {
              },
          }
      });
    } 
/*------------------DELETE Event END------------------*/
 /* --- Confirm Send For Approval---*/
 function sjpConfirmSendForApproval(){
    console.log("sjpConfirmSendForApproval running");
  $.confirm(
    {
        title: 'Do you want to send your SJP for Approval.',
        buttons: {
            confirm: function () {
              var Status = "Sent";
              var message = "";
              SJP.updateTpSentStatus(SJP.logged_User,Status,SJP.currentUserName);
            },
            cancel: function () {
                //$.alert('Canceled!');
            },
        }
    });
}
/* --- Confirm Send For Approval End--*/