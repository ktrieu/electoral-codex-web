const map_center = [-73.652344, 45.459996];

class VectorMap {

    constructor(map_file, element_id) {
        this.map_file = map_file;
        this.root = $(`#${element_id}`)[0];
        this.init_map();
    }

    init_map() {
        var root_rect = this.root.getBoundingClientRect();
        this.width = root_rect.width;
        this.height = 720; 

        var projection = d3.geoMercator()
            .center(map_center)
            .scale((1 << 30) / this.width / 2 / Math.PI)
            .translate([this.width / 2, this.height / 2])
            .precision(0);

        var tiler = d3.tile()
            .size([this.width, this.height])
            .scale(projection.scale() * 2 * Math.PI)
            .translate(projection([0, 0]))
        
        var path = d3.geoPath()
            .projection(projection);

        var svg = d3.select(this.root).append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        svg.selectAll('g')
            .data(tiler)
            .enter().append('g')
                .each(function (tile) {
                    var g = d3.select(this);
                    d3.json(`/maps/${tile[2]}/${tile[0]}/${tile[1]}/`)
                        .then(function(json) {
                            console.log(g);
                            g.selectAll('path')
                                .data(json.features)
                            .enter().append('path')
                                .attr('d', path)
                                .attr('class', 'poll-feature')
                        });
                });
    }
}

$(document).ready(function () {
    new VectorMap('polls_2004.mbtiles', 'poll-map');
});