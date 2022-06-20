$("#box-menu-btn-dashboard").on('click', showMussels);
$("#box-menu-btn-graphs").on('click', showGraphs);
$(".btn-dark").on('click', showParticularGraph); //for when the graph button first pressed
$("#graphs-btn-live").on('click', showParticularGraph); //for when different options are selected in graph page
$("#graphs-btn-hour").on('click', showParticularGraph);
$("#graphs-btn-12hours").on('click', showParticularGraph);
$("#graphs-btn-day").on('click', showParticularGraph);
$("#graphs-btn-week").on('click', showParticularGraph);
$("#graphs-btn-month").on('click', showParticularGraph);


$("#box-menu-btn-exports").on('click', showExports);
$("#box-menu-btn-ai").on('click', showAI);
$("#box-menu-btn-notifications").on('click', showNotifications);
$("#box-menu-btn-settings").on('click', showSettings);




function showMussels() {
    $(".applications").addClass("d-none");
    $("#box").removeClass("d-none");
}

function showGraphs() { //show graphs for all mussels for a particular box
    $(".applications").addClass("d-none");
    $("#graphs").removeClass("d-none");

    var boxNum = $(this).attr("data-box-num");



    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "/draw_all_mussel_data/" + boxNum, true); // false for synchronous request
    //httpRequest.open("GET", "/showBox/", true);
    httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                value = (httpRequest.responseText);
                //console.log("response is: " + value)
                var details = JSON.parse(value);
                console.log("details arrreee" + JSON.stringify(details));
                drawGraph(details);

            }
        };
    }


}

function showParticularGraph() { //show graph for only 1 mussel using small graph button
    var mussNum;
    var interval = 3600;
    var boxNum = $(this).attr("data-box-num");
    console.log(boxNum);

    var mussNumID = $(this).attr("id");
    console.log("mussnumIDDDDDD");
    if (mussNumID.slice(0, 9) == "graph-btn") {  //the 1hour,week... buttons ids are with graph"s"-btn, id of button under mussel images is with graph-btn without "s"
        console.log(mussNumID.slice(0, 9));
        interval = 1; //presets to "live" option
        mussNum = mussNumID.charAt(mussNumID.length - 1);
        console.log("mussNum is: ");
        console.log(mussNum);
        $("#graphs-btn-live").attr("data-muss-num", mussNum); //indicating for the graph button that, which box and which mussel it is used for
        $("#graphs-btn-hour").attr("data-muss-num", mussNum);
        $("#graphs-btn-12hours").attr("data-muss-num", mussNum);
        $("#graphs-btn-day").attr("data-muss-num", mussNum);
        $("#graphs-btn-week").attr("data-muss-num", mussNum);
        $("#graphs-btn-month").attr("data-muss-num", mussNum);
        $("#graphs-btn-live").attr("data-box-num", boxNum);
        $("#graphs-btn-hour").attr("data-box-num", boxNum);
        $("#graphs-btn-12hours").attr("data-box-num", boxNum);
        $("#graphs-btn-day").attr("data-box-num", boxNum);
        $("#graphs-btn-week").attr("data-box-num", boxNum);
        $("#graphs-btn-month").attr("data-box-num", boxNum);
    }


    if ($(this).attr("id").slice(0, 10) == "graphs-btn") { //the buttons are differentiated according to their id. The button under each mussel starts with #graps-btn and interval button ids are with #graph"s"-btn
        var intervalName = mussNumID.slice(11, mussNumID.length);
        console.log("intervalName is: ");
        console.log(intervalName);
        mussNum = $(this).attr("data-muss-num");
        if (intervalName == "hour") {
            interval = 1 * 3600;
            console.log(interval);
        }
        if (intervalName == "12hours") {
            interval = 12 * 3600;
            console.log(interval);
        }
        if (intervalName == "day") {
            interval = 24 * 3600;
            console.log(interval);
        }
        if (intervalName == "week") {
            interval = 24 * 7 * 3600;
            console.log(interval);
        }
        if (intervalName == "month") {
            interval = 24 * 7 * 4 * 3600;
            console.log(interval);
        }
        if (intervalName == "live") {
            interval = 1 * 3600;
            console.log(interval);
        }

    }

    var buttonType = mussNumID.slice(0, 5);
    console.log(buttonType);

    if (buttonType == "graph") {

        $(".applications").addClass("d-none");
        $("#graphs").removeClass("d-none");

        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", "/draw_particular_mussel_data/" + boxNum + "/" + mussNum + "/" + interval, true); // false for synchronous request
        //httpRequest.open("GET", "/showBox/", true);
        httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    value = (httpRequest.responseText);
                    console.log("draw_particular_mussel_data response is: " + value)
                    var details = JSON.parse(value);
                    console.log("details arrreee" + JSON.stringify(details)); //{"1":{"1654608323":1900,"1654691011":1520,"1654695361":1500,"1654698625":1470}}
                    drawGraph(details);

                };
            };
        };
    };

};

function showExports() {
    $(".applications").addClass("d-none");
    $("#export").removeClass("d-none");
}

function showAI() {
    $(".applications").addClass("d-none");
    $("#AI").removeClass("d-none");
}

function showNotifications() {
    $(".applications").addClass("d-none");
    $("#notifications").removeClass("d-none");
}

function showSettings() {
    $(".applications").addClass("d-none");
    $("#mussel-settings").removeClass("d-none");
}


