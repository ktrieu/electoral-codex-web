$(document).ready(function () {

    mapboxgl.accessToken = MAPBOX_KEY;
    var mapboxMap = new mapboxgl.Map({
        container: 'map-riding',
        style: mapboxStyleIds[YEAR],
    });

    mapboxMap.on('load', function(e) {
        var bounds = new mapboxgl.LngLatBounds()
        MAP_BOUNDS.forEach(coords => {
            bounds.extend(coords);
        })
        mapboxMap.fitBounds(bounds, {padding : 20});

        mapboxMap.setFilter('polls', [
            '==', ['get', 'R'], RIDING_NUM
        ]);
        mapboxMap.setFilter('ridings-stroke', [
            '==', ['get', 'R'], RIDING_NUM
        ]);
        mapboxMap.setFilter('ridings-fill', [
            '==', ['get', 'R'], RIDING_NUM
        ]);

    });


    var pollPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    mapboxMap.on('mouseenter', 'polls', function(e) {
        pollPopup.addTo(mapboxMap);
        updatePopup(pollPopup, e);
    });

    mapboxMap.on('mouseleave', 'polls', function(e) {
        pollPopup.remove();
    });

    mapboxMap.on('mousemove', 'polls', function(e) {
        updatePopup(pollPopup, e);
    });

});