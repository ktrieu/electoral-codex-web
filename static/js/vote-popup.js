seatsPopup = function(d, summary) {
    var party = d.key;
    var seats = summary.parties[party].seats;
    var votes = summary.parties[party].votes;

    var seatsPercent = 100 * seats / summary.total.seats;
    var votesPercent = 100 * votes / summary.total.votes;

    var averageSeatRatio = summary.total.votes / summary.total.seats;
    var seatRatio = votes / seats;
    var efficiencyIndex = averageSeatRatio / seatRatio;

    var html = `
    <div class='container popup-content'>
        <h4 class='border-bottom solid-${d.key}'>${getPartyFullName(d.key)}</h4>
        <div class="row">
            <div class="col-sm">
                <p>Seats:</p>
            </div>
            <div class="col-sm text-right">
                <p>${seatsPercent.toFixed(2)}%</p>
                <p class="text-right text-muted">${seats} seats</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p>Votes:</p>
            </div>
            <div class="col-sm text-right">
                <p>${votesPercent.toFixed(2)}%</p>
                <p class="text-right text-muted">${votes.toLocaleString()} votes</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p>Voter Efficiency:</p>
            </div>
            <div class="col-sm text-right">
                <p>${efficiencyIndex.toFixed(2)}</p>
            </div>
        </div>
    </div>`

    return html;
}

popupContent = function(ridingData) {
    return `
    <div class="popup-content">
        <h4 class="border-bottom">${ridingData.name}</h3>
        <div class="row">
            <div class="col-sm">
                <p class="solid-${ridingData.results[0].partyCode}">${ridingData.results[0].partyName}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[0].percent}%</p>
                <p class="text-right text-muted">${ridingData.results[0].votes.toLocaleString()} votes</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p class="solid-${ridingData.results[1].partyCode}">${ridingData.results[1].partyName}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[1].percent}%</p>
                <p class="text-right text-muted">${ridingData.results[1].votes.toLocaleString()} votes</p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <p class="solid-${ridingData.results[2].partyCode}">${ridingData.results[2].partyName}</p>
            </div>
            <div class="col-sm text-right">
                <p>${ridingData.results[2].percent}%</p>
                <p class="text-right text-muted">${ridingData.results[2].votes.toLocaleString()} votes</p>
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
            partyCode : votePairs[i][0],
            partyName : getPartyFullName(votePairs[i][0]),
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