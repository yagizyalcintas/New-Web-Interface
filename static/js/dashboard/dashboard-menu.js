$("#dashboard-menu-btn-dashboard").on('click', show_dashboard);
$("#dashboard-menu-btn-googlemaps").on('click', show_googlemaps);

function show_dashboard() {
    $("#dashboard").removeClass("d-none");
    $("#googlemaps").addClass("d-none");
}

function show_googlemaps() {
    $("#googlemaps").removeClass("d-none");
    $("#dashboard").addClass("d-none");
}