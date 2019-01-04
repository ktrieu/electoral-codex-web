popupContent = function(ridingData) {
    return `
    <div class="popup-content">
        <h4 class="border-bottom">${ridingData.name}</h3>
        <div class="row">
            <div class="col-sm">
                <p>${ridingData.results[0].party}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[0].percent}%</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p>${ridingData.results[1].party}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[1].percent}%</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p>${ridingData.results[2].party}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[2].percent}%</p>
            </div>
        </div>
    </div>
    `
}

updatePopup = function(popup, e) {
    var ridingProps = e.features[0].properties;
    popup.setLngLat(e.lngLat)
    //extract the vote numbers
    var votePairs = [];
    var totalVote = 0;
    for (var key in ridingProps) {
        var items = key.split('-');
        if (items[0] === 'V') {
            votePairs.push([items[1], ridingProps[key]]);
            totalVote += ridingProps[key];
        }
    }
    //sort by vote count
    votePairs.sort((a, b) => a[1] < b[1]);
    var resultArray = [];
    for (var i = 0; i < 3; i++) {
        resultArray.push({
            party : votePairs[i][0],
            percent : (100 * votePairs[i][1] / totalVote).toFixed(2)
        });
    }
    var ridingData = {
        //replace the double hyphens with single ones
        name : ridingProps.N.replace(/--/g, '-'),
        results : resultArray
    }
    popup.setHTML(popupContent(ridingData));
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