initVoteGraph = function() {
    var barHeight = 80  ;
    var resultsData = Object.entries(RIDING.votes).sort((a, b) => { return a[1].result < b[1].result; });
    var height = resultsData.length * barHeight;

    var margin = {top: 20, left: 150, right: 120, bottom: 20};
    var container = d3.select('#vote-graph');
    var containerWidth = container.node().clientWidth;
    var containerHeight = height + margin.top + margin.bottom;
    container.node().clientHeight = containerHeight;
    var root = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight);

    var width = containerWidth - margin.left - margin.right;

    var svg = root.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${margin.left},${margin.top})`);

    var parties = resultsData.map(x => { return x[0]; });
    console.log(parties);
    
    var partiesScale = d3.scaleBand()
        .domain(parties)
        .range([0, height])
        .padding(0.1);

    var percentScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    svg.selectAll()
        .data(resultsData)
        .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', d => { return partiesScale(d[0]); })
            .attr('height', partiesScale.bandwidth())
            .attr('class', d => { return `solid-${d[0]}`; })
            .transition()
                .duration(1000)
                .attr('width', d => { return percentScale(d[1].percent); });

    var partiesAxis = d3.axisLeft(partiesScale)
        .ticks(parties)
        .tickFormat(d => { '' });

    var axisText = svg.append('g')
        .call(partiesAxis)
        .selectAll('text')
    
    setAxisText = function(d, i) {
        var text = d3.select(this)
        text.append('tspan')
            .text(getPartyFullName(resultsData[i][1].party))
            .attr('x', -10)
        text.append('tspan')
            .text(resultsData[i][1].name)
            .style('font-size', '12px')
            .attr('x', -10)
            .attr('dy', '15px')
    }

    axisText.style('font-family', "IBM Plex Mono")
        .style('font-size', '15px')
        .each(setAxisText)
    
        
    var percentAxis = d3.axisTop(percentScale)
        .ticks(10, '%');

    svg.append('g')
        .call(percentAxis)
        .selectAll('text')
            .style('font-family', "IBM Plex Mono")
            .style('font-size', '15px');
            
}

$(document).ready(function () {

    mapboxgl.accessToken = MAPBOX_KEY;
    var mapboxMap = new mapboxgl.Map({
        container: 'map-riding',
        style: mapboxStyleIds[YEAR],
    });

    mapboxMap.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    mapboxMap.on('load', function(e) {
        var bounds = new mapboxgl.LngLatBounds()
        MAP_BOUNDS.forEach(coords => {
            bounds.extend(coords);
        })
        mapboxMap.fitBounds(bounds, {padding : 20});

        //add a poll stroke to the map's style
        var style = mapboxMap.getStyle();
        style.layers.forEach(layer => {
            if (layer.id === 'polls') {
                layer.paint['fill-outline-color'] = 'rgba(255, 255, 255, 1)';
            }
        });

        mapboxMap.setStyle(style);

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

    initVoteGraph();

});