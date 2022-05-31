$("#box-menu-btn-dashboard").on('click', showMussels);
$("#box-menu-btn-graphs").on('click', showGraphs);
$(".btn-dark").on('click', showParticularGraph);  //<button type="button" class="btn btn-dark" id="graph-btn-5" data-box-num="1"><i class="fas fa-chart-bar"></i></button>

function showalert() {
    console.log("onclick WITHIN JSSSSSSSSSSSSSSSSS");
}


$("#box-menu-btn-exports").on('click', showExports);
$("#box-menu-btn-ai").on('click', showAI);
$("#box-menu-btn-notifications").on('click', showNotifications);
$("#box-menu-btn-settings").on('click', showSettings);

function showMussels() {
    $(".applications").addClass("d-none");
    $("#box").removeClass("d-none");
}

function showGraphs() {
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

function showParticularGraph() {

    var boxNum = $(this).attr("data-box-num");
    var mussNumID = $(this).attr("id");
    console.log(mussNumID);
    var mussNum = mussNumID.charAt(mussNumID.length - 1);
    console.log("mussNum is: ");
    console.log(mussNum);
    var buttonType = mussNumID.slice(0, 5);
    console.log(buttonType);

    if (buttonType == "graph") {

        $(".applications").addClass("d-none");
        $("#graphs").removeClass("d-none");

        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", "/draw_particular_mussel_data/" + boxNum + "/" + mussNum, true); // false for synchronous request
        //httpRequest.open("GET", "/showBox/", true);
        httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    value = (httpRequest.responseText);
                    console.log("draw_particular_mussel_data response is: " + value)
                    var details = JSON.parse(value);
                    console.log("details arrreee" + JSON.stringify(details)); //{"5":{"1649159418":1500,"1649166643":1600}}
                    drawGraph(details);

                }
            };
        }
    }

}

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


