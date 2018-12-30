$(document).ready(function () {
    mapboxgl.accessToken = MAPBOX_KEY;
    var mapboxMap = new mapboxgl.Map({
        container: 'map-main',
        style: 'mapbox://styles/kevintrieu/cjq93yzad9fpm2rocm2a27hqi',
        center: [-103.338053, 60.772455],
        zoom: 2.8
    });
});