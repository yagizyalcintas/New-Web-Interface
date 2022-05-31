var map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        mapId: "67db8c302ba8ba52",
        center: { lat: 48.2648, lng: 11.6695 },
        zoom: 12,
        disableDefaultUI: true,

    });

    const ecosophLogo = document.createElement("div");
    ECOSOPHLogo(ecosophLogo);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(ecosophLogo)
}


/**
 * Generates a Google Maps marker with the correct color
 */
function generatePin(pinColor) {
    var pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";

    var markerImage = { // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGHole,
        anchor: new google.maps.Point(15, 21),
        fillOpacity: 1,
        fillColor: pinColor,
        strokeWeight: 2,
        strokeColor: "white",
        scale: 2,
        labelOrigin: new google.maps.Point(0, 0)
    };
    return markerImage
}


/**
 * Update the map's markers value if the map is visible, otherwise cancel the auto update
 */
function updateWhileVisible() {
    if ($("#googlemaps").hasClass("d-none")) {
        clearInterval(update_interval);
    } else {
        loadMarkers(true);
    }
}


/**
 * Loads markers into the map
 * @param {bool} update Whether the markers are being updated or if its the first setup 
 */
function loadMarkers(update = false) {
    const infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    if (!update) clearOverlays();
    // Check how to best replace this with current data
    makeRequest("GET", `/getLocations/${selectedDevice}/`, "", function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            let result = JSON.parse(this.responseText);
            console.log(result);
            for (var marker in result) {
                localMarker = new google.maps.Marker({
                    map: mainMap,
                    position: new google.maps.LatLng(result[marker][1], result[marker][2]),
                    icon: generatePin(50)
                });
                bounds.extend(localMarker.position);
                localMarker.data = { id: marker, title: result[marker][0], fields: result[marker][3], units: result[marker][4] };
                localMarker.addListener('mouseover', function() {
                    fieldsString = ""
                    console.log(this.data.units);
                    var count = 0
                    for (field in this.data.fields) {
                        console.log(field);
                        fieldsString += `<span style="font-size: 1.3em;font-weight:bold; margin-right:2px;">${field}:</span><span style="font-size: 1.2em;font-weight:300;">${this.data.fields[field]}${this.data.units[count]}</span></br>`;
                        count++;
                    }
                    infowindow.setContent(`
                    <div style="font-size: 1.5em;font-weight:bold;text-align:center;background-color: lightgray; margin: 3px;">${this.data.title}</div> <br/>
                    ${fieldsString}
                    `);
                    infowindow.open(mainMap, this);
                });

                // assuming you also want to hide the infowindow when user mouses-out
                localMarker.addListener('mouseout', function() {
                    infowindow.close();
                });
                markersArray.push(localMarker);

            }
            if (!update) mainMap.fitBounds(bounds);
            if (!update) update_interval = setInterval(updateWhileVisible, 4000);
        }
    });
}


/**
 * Draw and append the ECOSOPH logo
 * @param {*} controlDiv div element to be appended to
 */
function ECOSOPHLogo(controlDiv) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");

    controlUI.style.borderRadius = "3px";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.style.userSelect = "none";
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    const controlText = document.createElement("div");

    controlText.style.color = "rgb(250,250,250)";
    controlText.style.fontSize = "64px";
    controlText.style.fontWeight = "900";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "10px";
    controlText.style.paddingTop = "10px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "ECOSOPH";
    controlUI.appendChild(controlText);
}


/**
 * Clears all markers from the map
 */
function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}