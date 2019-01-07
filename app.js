var express = require('express');
var handlebars = require('express-handlebars');

//load in static data files
var riding_bounds = {
    2004: require('./json_data/bounds_2004.json')
};

var app = express();

var handlebarOpts = {
    defaultLayout: 'base',
    helpers : {
        json : function(ctx) { JSON.stringify(ctx) }
    }
}

app.engine('handlebars', handlebars(handlebarOpts));
app.set('view engine', 'handlebars');

app.use('/static', express.static('static/'));

app.get('/', function(req, res) {
    res.redirect('/2004');
});

app.get('/:year', function(req, res) {
    res.render('past-election', { 
        mapbox_key: process.env.MAPBOX_KEY,
        js: ['past-election', 'vote-popup'],
        css: ['past-election', 'vote-popup'],
        year: req.params.year
    });
});

app.get('/:year/riding/:riding_num', function(req, res) {
    res.render('past-riding', {
       mapbox_key : process.env.MAPBOX_KEY,
       js: ['past-riding', 'vote-popup'],
       css: ['past-riding', 'vote-popup'],
       year: req.params.year,
       riding_num : req.params.riding_num,
       map_bounds: JSON.stringify(riding_bounds[req.params.year][req.params.riding_num][0])
    });
})

app.listen(3000);