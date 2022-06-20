
Loop_boxes(); ////////////////////77



function show_mussel() { //shows the inner interface of box when clicked on it
    //TODO: Add class instead of manually specifying
    $(".main-container").addClass("d-none");
    $(".sub-menu").addClass("d-none");
    $("#box").removeClass("d-none");

    var boxId = $(this).attr('id');
    $("#box-menu-btn-graphs").attr("data-box-num", boxId);
    $(".btn-dark").attr("data-box-num", boxId);


    group_mussels_datas(boxId);
    group_mussels_names(boxId);


    $("#box-menu").removeClass("d-none");
    $(".hidable-navigation-control").removeClass("d-none");
    console.log("clicked on one of dashboard-card");
}

var k = 0;


function Loop_boxes() {


    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "/showBox/", true); //adds boxes to the dashboard
    httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            value = (httpRequest.response);
            $("#dashboard").append(value);
            var httpRequest2 = new XMLHttpRequest();
            httpRequest2.open("GET", "/getLastUpdated/", true); //puts the last updated field under boxes but it is taken as a static value from database as a field (as requested)
            httpRequest2.setRequestHeader('X-CSRFToken', csrfToken);
            //httpRequest.responseType = 'document';
            httpRequest2.send();
            httpRequest2.onreadystatechange = function () {
                if (httpRequest2.readyState === XMLHttpRequest.DONE) { //puts the corrects color image according to last update
                    value = (httpRequest2.response);
                    console.log("getLastUpdated response is: " + typeof (value) + value.length);
                    var details = JSON.parse(value);
                    console.log("timestampsssss:" + typeof (details) + JSON.stringify(details));
                    for (const [key, value] of Object.entries(details.timestamps)) {
                        console.log(parseInt(key) + 1);
                        console.log("details.status[1]");
                        console.log(details.status[1]);
                        $(`#footer${parseInt(key) + 1}`).html("Last Updated: " + approximateTimeDiff(value));
                        for (var i = 1; i < 9; i++) {
                            if (details.status[parseInt(key) + 1][i] == -1) {
                                $(`#m${(parseInt(key) + 1)}${i}`).html(`<img src='${"static/images/mussel_purple.png"}' style="width:100%;">`)
                            };
                            if (details.status[parseInt(key) + 1][i] == 0) {
                                $(`#m${(parseInt(key) + 1)}${i}`).html(`<img src='${"static/images/mussel_pink.png"}' style="width:100%;">`)
                            };
                            if (details.status[parseInt(key) + 1][i] == 1) {
                                $(`#m${(parseInt(key) + 1)}${i}`).html(`<img src='${"static/images/mussel_green.png"}' style="width:100%;">`)
                            };

                        }


                    }
                    $(".dashboard-card").off('click');
                    $(".dashboard-card").on('click', show_mussel);
                    $(".loader").addClass("d-none")

                }
            };
        }
    };
}


function approximateTimeDiff(ending) {
    let starting = Math.floor(Date.now() / 1000);
    ending = Math.floor(ending);
    difference = starting - ending;
    if (difference < 60) {
        return (`${difference} seconds ago`);
    } else if (difference < 3600) {
        return (`${Math.round(difference / 60)} minutes ago`);
    } else if (difference < 86400) {
        return (`${Math.round(difference / 3600)} hours ago`);
    } else if (difference < 2592000) {
        return (`${Math.round(difference / 86400)} days ago`);
    } else {
        return (`${Math.round(difference / 2592000)} months ago`);
    }
}


function group_mussels_names(id) { //put mussel names when clicked on boxes according to box number and mussel number. box number:2 muss num:3 --> m23. Also updates mussel data every X seconds. (currently 35)

    console.log("1")
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "/box_mussels_names/" + id, true);
    httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            value = (httpRequest.responseText);
            var names = JSON.parse(value);
            console.log("mussel name 2.: " + names['2']);
            console.log(typeof (names));
            for (var i = 1; i < 9; i++) {
                $(`#mussel${i}-name`).html(names[`${i}`])
            }

            setInterval(() => {
                group_mussels_datas(id)
            }, 35000);
        }
    };
}

function group_mussels_datas(id) {

    var httpRequest2 = new XMLHttpRequest(); //adds the voltage values for mussels
    httpRequest2.open("GET", "/box_mussels_data/" + id, true);
    httpRequest2.setRequestHeader('X-CSRFToken', csrfToken);
    httpRequest2.send();
    httpRequest2.onreadystatechange = function () {
        if (httpRequest2.readyState === XMLHttpRequest.DONE) {
            value = (httpRequest2.responseText);
            var data = (JSON.parse(value));
            console.log("box_mussels_data:" + typeof (data) + JSON.stringify(data));
            console.log(typeof (data));
            for (var i = 1; i < 9; i++) {
                console.log("3")
                $(`#mussel${i}-data`).html(`<b>Voltage: ${data[`${i}`]}mV</b> </br>
                                            <b>Filt. Activity:</b> </br>
                                            <b>Filt. Frequency:</b></br>`);
            }
        }

        var httpRequest3 = new XMLHttpRequest();
        httpRequest3.open("GET", "/groupsData/" + id, true); //gets the satus array and puts the correct image according to status value
        httpRequest3.setRequestHeader('X-CSRFToken', csrfToken);

        httpRequest3.send();
        httpRequest3.onreadystatechange = function () {
            if (httpRequest3.readyState === XMLHttpRequest.DONE) {
                console.log("4")
                value = (httpRequest3.response);

                var details = JSON.parse(value);

                for (var i = 1; i < 9; i++) {
                    $(`#box-footer${parseInt(i)}`).html("Last Updated: " + approximateTimeDiff(details.timestamps[i])); //${key}
                };
                for (var i = 1; i < 9; i++) {
                    if (details.status[i] == -1) {
                        $(`#box-m${parseInt(i)}`).html(`<span style="font-size: 15px;
                        font-weight: 900;
                        margin-left: 25px;">Disconnected</span>
                        <img src="${"static/images/mussel_purple.png"}" style="width: 100%;
                        margin-left: 15px;">`)
                    };
                    if (details.status[i] == 0) {
                        $(`#box-m${parseInt(i)}`).html(`<span style="font-size: 15px;
                        font-weight: 900;
                        margin-left: 25px;">Closed</span>
                        <img src="${"static/images/mussel_red.png"}" style="width: 100%;
                        margin-left: 15px;">`)
                    };
                    if (details.status[i] == 1) {
                        $(`#box-m${parseInt(i)}`).html(`<span style="font-size: 15px;
                        font-weight: 900;
                        margin-left: 25px;">Open</span>
                        <img src="${"static/images/mussel_green.png"}" style="width: 100%;
                        margin-left: 15px;">`)
                    };

                };
            };
        };
    };
}


