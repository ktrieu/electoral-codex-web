popupContent = function(ridingData) {
    return `
    <div class="popup-content">
        <h4 class="border-bottom">${ridingData.name}</h3>
        <div class="row">
            <div class="col-sm">
                <p class="solid-${ridingData.results[0].party}">${ridingData.results[0].party}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[0].percent}%</p>
                <p class="text-right text-muted">${ridingData.results[0].votes} votes</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p class="solid-${ridingData.results[1].party}">${ridingData.results[1].party}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[1].percent}%</p>
                <p class="text-right text-muted">${ridingData.results[1].votes} votes</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p class="solid-${ridingData.results[2].party}">${ridingData.results[2].party}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[2].percent}%</p>
                <p class="text-right text-muted">${ridingData.results[2].votes} votes</p>
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
            percent : (100 * votePairs[i][1] / totalVote).toFixed(2),
            votes: votePairs[i][1]
        });
    }
    var ridingData = {
        //replace the double hyphens with single ones
        name : ridingProps.N.replace(/--/g, '-'),
        results : resultArray
    }
    popup.setHTML(popupContent(ridingData));
}