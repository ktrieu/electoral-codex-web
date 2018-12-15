var express = require('express');
var handlebars = require('express-handlebars');

var maps = require('./maps');

maps.load_all_mbtiles();

var app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

app.get('/', function(req, res) {
    res.render('home', {layout: 'base'});
});

app.get('/maps/:zoom/:x/:y/', function(req, res) {
    maps.get_tile_as_JSON(
        'polls_2004.mbtiles', req.params.zoom, req.params.x, req.params.y, 
        (err, tile_json) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(tile_json);
            }
        });
});

app.listen(3000);