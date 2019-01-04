$(document).ready(function () {
    mapboxgl.accessToken = MAPBOX_KEY;
    var mapboxMap = new mapboxgl.Map({
        container: 'map-main',
        style: mapboxStyleIds[YEAR],
        center: [-103.338053, 60.772455],
        zoom: 2.8
    });

    var ridingPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    mapboxMap.on('mouseenter', 'ridings-fill', function(e) {
        ridingPopup.addTo(mapboxMap);
        updatePopup(ridingPopup, e);
    });

    mapboxMap.on('mouseleave', 'ridings-fill', function(e) {
        ridingPopup.remove();
    });

    mapboxMap.on('mousemove', 'ridings-fill', function(e) {
        updatePopup(ridingPopup, e);
    });

});