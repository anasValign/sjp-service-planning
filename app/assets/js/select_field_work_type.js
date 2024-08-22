//Api to get area
var selectedDay = '';
$('.selectDay').change(function() {
    var selectRole = $('.selectRole').val();
    /*if((selectRole == 'FLSP') || (selectRole == 'RBH') || (selectRole == 'ZBH'))
    {*/
    $('.field-work-area').show();
    /*}*/
    selectedDay = $('.selectDay option:selected').text();
    var userHqId = $('#userHqId').val();
    var currUsrId = $('#userId').val();
    var userSelectedYear = $('#userSelectedYear').val();
    var request = {
        url: 'https://www.zohoapis.in/crm/v2/STP_CRM/search?criteria=((Year:equals:' + userSelectedYear + ')and(Owner:equals:' + currUsrId + ')and(Day:equals:' + selectedDay + '))',
        headers: {
            Authorization: 'Zoho-oauthtoken ' + access_token,
        }
    }
    ZOHO.CRM.HTTP.get(request)
        .then(function(data) {
            var data = JSON.parse(data);
            var areas = data.data[0].Areas_Planned;
            $('#areas').val(areas);
            var areasArray = areas.split(',');
            var selectedAreas = '';
            $.each(areasArray, function(key, val) {
                selectedAreas += '<option selected="selected" >' + val + '</option>';
            });
            $('select.areaSelector').html(selectedAreas);
            $('.selectpicker').selectpicker('refresh')

            //API COQL to get other areas
            var selected = [];
            $('.areaSelector :selected').each(function() {
                alert('.areaSelector selected');
                selected.push($(this).text());
            });
            selectedArea = selected.toString();
            ZOHO.CRM.API.getAllRecords({
                Entity: "Area",
                sort_order: "asc",
                per_page: 100,
                page: 1
            }).then(function(data) {
                //console.log('all areas');
                //console.log(data)
                var otherAreas = ''
                $.each(data.data, function(key, val) {
                    otherAreas += '<option>' + val.Name + '</option>';
                });
                console.log('below are the otherAreas');
                console.log(otherAreas);
                $('select.areaSelector').append(otherAreas);
                $('.selectpicker').selectpicker('refresh')
            })

            /*ZOHO.CRM.API.searchRecord({
            Entity:"TP_CRM",Type:"criteria",Query:"(select Name from Area where Name  not in ("+selectedArea+")"})
            .then(function(data){
               //console.log(data)
                var otherAreas = ''
                $.each(data.data, function(key, val) {
                    otherAreas += '<option>' + val.Name + '</option>';
                });
                console.log('below are the otherAreas');
                console.log(otherAreas);
                $('select.areaSelector').append(otherAreas);
                $('.selectpicker').selectpicker('refresh')
            })*/
            //API to get area type 
            var selected = [];
            $('.areaSelector :selected').each(function() {
                selected.push($(this).text());
            });
            //console.log('all aresa');
            console.log(selected);
            selectedArea = selected.toString();
            //API COQL call to get area type on select
            var query = {
                "select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + userHqId + "'"
                //"select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + userHqId + "'"
            }
            var jsonStrBody = JSON.stringify(query);
            var request = {
                url: "https://www.zohoapis.in/crm/v2/coql",
                body: jsonStrBody,
                headers: {
                    Authorization: 'Zoho-oauthtoken ' + access_token,
                }
            }

            ZOHO.CRM.HTTP.post(request)
                .then(function(data) {
                    var data = JSON.parse(data);
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
                })
            //API to get area type on changed
            $('.areaSelector').change(function() {
                var selected = [];
                $('.areaSelector :selected').each(function() {
                    selected.push($(this).text());
                });
                selectedArea = selected.toString();
                //API COQL call to get type on select
                var query = {
                    "select_query": "select Area_Type from Area_Type_Master where Name in (" + selectedArea + ") and HQ = '" + userHqId + "'"
                }
                var jsonStrBody = JSON.stringify(query);
                var request = {
                    url: "https://www.zohoapis.in/crm/v2/coql",
                    body: jsonStrBody,
                    headers: {
                        Authorization: 'Zoho-oauthtoken ' + access_token,
                    }
                }

                ZOHO.CRM.HTTP.post(request)
                    .then(function(data) {
                        var data = JSON.parse(data);
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
                    })

            })
        })
});