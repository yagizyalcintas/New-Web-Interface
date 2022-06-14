
var dataArray1 = [];
var dataArray2 = [];
var dataArray3 = [];
var dataArray4 = [];
var dataArray5 = [];
var dataArray6 = [];
var dataArray7 = [];
var dataArray8 = [];
var firstTimestamp = 1651100000; //1649166721
var lastTimestamp = 0;





//$("#graph-loading").removeClass("d-none");
$("#graph-space").addClass("d-none");
$("#graph-space").append('<canvas id="graph-canvas"></canvas>'); //style="height:550, width:1400px"
//document.getElementById("graph-space").style.height = "900px";
//document.getElementById("graph-canvas").style.height = "500px";
var ctx = $('#graph-canvas');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Group 1", "Group 2", "Group 3"],
        datasets: [{
            label: 'Groups',
            data: [12, 19, 3]
        }]
    }
});



// $("#groupscv").on('click', download_csv_file);

const colors = ["rgb(211, 216, 226)", "rgb(134, 91, 228)", "rgb(0, 236, 192)", "rgb(255, 230, 63)", "rgb(255, 0, 112)", "rgb(220, 45, 51)", "rgb(50, 127, 234)", "rgb(51, 76, 116)"]
/**
 * Sets the Count, Average, Min and Max fields for an array
 * of data
 * @param {Array[number]} data 
 */
function drawStatistics(data) {
    var dataArray = Object.keys(data).map(function (key) {
        return data[key];
    })
    $('#graph-count').html(dataArray.length);
    $('#graph-max').html(Math.max(...dataArray));
    $('#graph-min').html(Math.min(...dataArray));
    $('#graph-avg').html((dataArray.reduce((a, b) => a + b, 0)) / dataArray.length || 0);
    $('.graph-statistics').removeClass("d-none");
}

function drawGraph(datas) {
    $("#graphs-btn-live").removeClass("d-none");
    $("#graphs-btn-hour").removeClass("d-none");
    $("#graphs-btn-12hours").removeClass("d-none");
    $("#graphs-btn-day").removeClass("d-none");
    $("#graphs-btn-week").removeClass("d-none");
    $("#graphs-btn-month").removeClass("d-none");
    myChart.destroy();
    dataArray1 = [];
    dataArray2 = [];
    dataArray3 = [];
    dataArray4 = [];
    dataArray5 = [];
    dataArray6 = [];
    dataArray7 = [];
    dataArray8 = [];
    //var ctx2 = $('#graph-canvas');
    console.log("DRAWGRAPH ARGUMENT -DATAS-: ");
    console.log(JSON.stringify(datas));



    var chartData = { datasets: [] };
    if (datas.length == 1) {
        drawStatistics(datas[0]);
    }

    // var vals = Object.keys(countries).map(function(key) {
    //     return countries[key];
    // });
    for (const [i, element] of Object.entries(datas)) {
        console.log("element");
        console.log(element);
        //var dataArr = [];
        for (entry in element) {
            console.log("entry");
            console.log(entry);
            if (entry < firstTimestamp) {
                console.log("entry smaller");
                console.log("firstTimestamp");
                console.log(firstTimestamp);
                console.log("entry");
                console.log(entry);
                firstTimestamp = entry;
            }
            if (entry > lastTimestamp) {
                console.log("entry bigger");
                console.log("firstTimestamp");
                console.log(firstTimestamp);
                console.log("entry");
                console.log(entry);
                lastTimestamp = entry;
            }
            eval("dataArray" + i).push({ x: new Date(parseInt(entry * 1000)), y: element[entry] }); //new Date()
        }

        console.log("dataArrrrrrrrrrrrrrrr");
        console.log(dataArray1);
        // {x: Tue Apr 05 2022 13:51:09 GMT+0200 (Orta Avrupa Yaz Saati), y: 1500}

        chartData.datasets.push({
            borderColor: colors[i],
            label: `mussel${i}`,
            data: eval("dataArray" + i),
            lineTension: 0.1,

        });
        console.log("chartData: ");
        console.log(chartData);
    }

    // rgb(204, 209, 220)

    myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            //responsive: true,
            //maintainAspectRatio: true,
            parsing: true, //when uncommented only some part of data can be seen
            scales: {
                x: {
                    type: "time",
                    displayFormats: {
                        quarter: 'h:mm a'
                    },
                    ticks: {
                        color: "rgb(40, 47, 63)",

                    },
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    },

                },
                y: {
                    ticks: {
                        color: "rgb(40, 47, 63)"
                    }
                }
            }
        },
        // maintainAspectRatio: false,
        // elements: {
        //     point: {
        //         radius: 0
        //     }
        // },

    },
    );
    $("#graph-loading").addClass("d-none");
    $("#graph-space").removeClass("d-none");
}


// $("#groupcsv").on('click', download_group_csv_file);
// function download_group_csv_file() {
//     var BoxNum = $(this).attr("data-box-num");

//     var httpRequest = new XMLHttpRequest();
//     httpRequest.open("GET", "/export_group_csv/" + BoxNum, true); // false for synchronous request
//     //httpRequest.open("GET", "/showBox/", true);
//     httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
//     httpRequest.send();
//     httpRequest.onreadystatechange = function () {
//         {
//             if (httpRequest.readyState === XMLHttpRequest.DONE) {
//                 value = (httpRequest.responseText);
//                 //console.log("response is: " + value)
//                 var details = JSON.parse(value);
//                 console.log(details)

//             }
//         };
//     }
// }

//change group csv with #musselcsv
// function download_csv_file() {
//     var BoxNum = $(this).attr("data-box-num");

//     var httpRequest = new XMLHttpRequest();
//     httpRequest.open("GET", `/export_mussel_csv/2/${firstTimestamp}/${lastTimestamp}`, true); // change BoxNum with id of the mussel
//     //httpRequest.open("GET", "/showBox/", true);
//     httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
//     httpRequest.send();
//     httpRequest.onreadystatechange = function () {
//         {
//             if (httpRequest.readyState === XMLHttpRequest.DONE) {
//                 value = (httpRequest.responseText);
//                 console.log("response is: " + value)
//                 var details = JSON.parse(value);
//                 console.log(details)

//             }
//         };
//     }
// }


// function download_csv_file() {
//     var BoxNum = $(this).attr("data-box-num");

//     var httpRequest = new XMLHttpRequest();
//     httpRequest.open("GET", "/get_mussel_data/" + 1, true); // change BoxNum with id of the mussel + "/" + firstTimestamp + "/" + lastTimestamp
//     //httpRequest.open("GET", "/showBox/", true);
//     httpRequest.setRequestHeader('X-CSRFToken', csrfToken);
//     httpRequest.send();
//     httpRequest.onreadystatechange = function () {
//         {
//             if (httpRequest.readyState === XMLHttpRequest.DONE) {
//                 value = (httpRequest.responseText);
//                 console.log("response is: " + JSON.parse(value))
//                 // var details = JSON.parse(value);
//                 // console.log(details)

//             }
//         };
//     }
// }
