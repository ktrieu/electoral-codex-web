updatePopup = function(popup, e) {
    var ridingProps = e.features[0].properties;
    popup.setHTML(`<h1>${ridingProps.N}</h1>`)
        .setLngLat(e.lngLat)
}

$(document).ready(function () {
    mapboxgl.accessToken = MAPBOX_KEY;
    var mapboxMap = new mapboxgl.Map({
        container: 'map-main',
        style: 'mapbox://styles/kevintrieu/cjq93yzad9fpm2rocm2a27hqi',
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