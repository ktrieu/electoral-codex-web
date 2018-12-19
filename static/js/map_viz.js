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
   
        this.zoom = d3.zoom()
            .on('zoom', _ => this.onZoom(d3.event.transform));

        this.svg = d3.select(this.root).append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(this.zoom);

        this.g_container = this.svg.append('g')

        this.projection = d3.geoMercator()
            .scale(10000 / 2 / Math.PI)
            .translate([0, 0]);

        this.path = d3.geoPath()
            .projection(this.projection);
    }

    onZoom(transform) {

        //save variables because d3 replaces 'this'
        var path = this.path;
        
        var tiler = d3.tile()
            .size([this.width, this.height])
            .translate([transform.x, transform.y])
            .scale(10000 * transform.k)

        this.g_container.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);

        console.log(transform.k);

        var groups = this.g_container.selectAll('g')
            .data(tiler, function (d) { return `${d[2]}-${d[0]}-${d[1]}`});

        groups.enter().append('g')
            .each(function (tile) {
                var g = d3.select(this);
                var zoom = tile[2];
                var x = tile[0];
                var y = tile[1];

                var max_zoom = 11;
                if (zoom > max_zoom) {
                    // since these are vector tiles we can just overzoom the z10 ones
                    x = Math.floor(x / Math.pow(2, zoom - max_zoom));
                    y = Math.floor(y / Math.pow(2, zoom - max_zoom));
                    zoom = max_zoom;
                }
                g.attr('id', `tile-${zoom}-${x}-${y}`)
                d3.json(`/maps/${zoom}/${x}/${y}/`)
                    .then(function(json) {
                        g.selectAll('path')
                            .data(json.features)
                        .enter()
                            .append('path')
                            .attr('d', path)
                            .attr('class', 'poll-feature')
                            .attr('vector-effect',  'non-scaling-stroke')
                    });
            });
        
        groups.exit().remove();
    }
}

$(document).ready(function () {
    new VectorMap('polls_2004.mbtiles', 'poll-map');
});