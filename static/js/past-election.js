createMap = function() {
    mapboxgl.accessToken = MAPBOX_KEY;
    var mapboxMap = new mapboxgl.Map({
        container: 'map-main',
        style: mapboxStyleIds[YEAR],
        center: [-103.338053, 60.772455],
        zoom: 2.8
    });

    mapboxMap.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

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

    mapboxMap.on('click', 'ridings-fill', function(e) {
        window.location.href = `/${YEAR}/riding/${e.features[0].properties.R}`;
    });
}

majorityThreshold = function(totalSeats) {
    if (totalSeats % 2 == 0) {
        return (totalSeats / 2) + 1;
    }
    else {
        return Math.ceil(totalSeats / 2);
    }
}

createSeatsGraph = function() {
    var container = d3.select('#seats-graph');
    var containerWidth = container.node().clientWidth;
    var containerHeight = container.node().clientHeight;

    var root = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight)

    var margin = {top: 70, right: 30, bottom: 70, left: 30};
    var width = containerWidth - margin.left - margin.right;
    var height = containerHeight - margin.top - margin.bottom;

    var svg = root.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${margin.left},${margin.top})`);

    var seatsScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, SUMMARY.total.seats]);

    var seatsAxis = d3.axisTop(seatsScale)
        .tickValues([majorityThreshold(SUMMARY.total.seats)])
        .tickFormat(d => { return `Majority (${d} seats)` })
        .tickSizeInner(20)
        .tickPadding(10)
        .tickSizeOuter(0);

    svg.append('g')
        .style('font-family', 'IBM Plex Mono')
        .style('font-size', '1em')
        .call(seatsAxis);

    var votesScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width])

    var votesAxis = d3.axisBottom(votesScale)
        .ticks(10, '.0%')
        .tickSizeInner(20)
        .tickPadding(10);

    svg.append('g')
        .style('font-family', 'IBM Plex Mono')
        .style('font-size', '1em')
        .attr('transform', `translate(0, ${height})`)
        .call(votesAxis);

    var seatsData = [{}, {}];
    for (party in SUMMARY.parties) {
        if (party == 'ALL') {
            continue;
        }
        seatsData[0][party] = SUMMARY.parties[party].seats;
        seatsData[1][party] = SUMMARY.parties[party].votes / SUMMARY.total.votes;
    }
    
    var stack = d3.stack()
        .keys(['BQ', 'CON', 'GRN', 'LIB', 'NDP', 'OTH'])
        .order(d3.stackOrderDescending)
        .offset(d3.stackOffsetNone);

    var barHeight = height / 3;

    var entry = svg.selectAll()
        .data(stack(seatsData))
        .enter();

    entry.append('rect')
        .attr('x', d => { return seatsScale(d[0][0]) })
        .attr('y', 0)
        .attr('width', d => { return seatsScale(d[0][1]) - seatsScale(d[0][0]) })
        .attr('height', barHeight)
        .attr('class', d => { return `solid-${d.key}` });

    entry.append('rect')
        .attr('x', d => { return votesScale(d[1][0]) })
        .attr('y', barHeight * 2)
        .attr('width', d => { return votesScale(d[1][1]) - votesScale(d[1][0]) })
        .attr('height', barHeight)
        .attr('class', d => { return `solid-${d.key}` });

    generatePolygonPoints = function(d) {
        var topLeft = [seatsScale(d[0][0]), barHeight];
        var topRight = [seatsScale(d[0][1]), barHeight];
        var bottomLeft = [votesScale(d[1][0]), barHeight * 2];
        var bottomRight = [votesScale(d[1][1]), barHeight * 2];
        return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
    }

    entry.append('polygon')
        .attr('points', generatePolygonPoints)
        .attr('class', d => { return `solid-${d.key}`})
        .style('opacity', 0.5);
}

$(document).ready(function () {
    createMap();
    createSeatsGraph();
});