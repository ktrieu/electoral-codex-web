var express = require('express');
var handlebars = require('express-handlebars');

var db = require('./db.js');
var helpers = require('./helpers.js')

//load in static data files
var riding_bounds = {
    2004: require('./json_data/bounds_2004.json'),
    2006: require('./json_data/bounds_2006.json'),
    2008: require('./json_data/bounds_2008.json'),
    2011: require('./json_data/bounds_2011.json'),
    2015: require('./json_data/bounds_2015.json')
};

var app = express();

var handlebarOpts = {
    defaultLayout: 'base',
    helpers : {
        json : JSON.stringify,
        party_noun: helpers.party_to_noun,
        majority_seats: helpers.majority_seats
    }
}


app.engine('handlebars', handlebars(handlebarOpts));
app.set('view engine', 'handlebars');

app.use('/static', express.static('static/'));

app.get('/', function(req, res) {
    res.redirect('/2004');
});

app.get('/:year', function(req, res) {
    db.get_summary_data(req.params.year).then(function(summary) {
        res.render('past-election', { 
            mapbox_key: process.env.MAPBOX_KEY,
            js: ['past-election', 'vote-popup'],
            css: ['past-election', 'vote-popup'],
            year: req.params.year,
            summary : summary
        });
    }).catch(function(err) {
        res.send(err);
    });
});

app.get('/:year/riding/:riding_num', function(req, res) {
    db.get_riding_data(req.params.year, req.params.riding_num).then(function (riding_data) {
        res.render('past-riding', {
            mapbox_key : process.env.MAPBOX_KEY,
            js: ['past-riding', 'vote-popup'],
            css: ['past-riding', 'vote-popup'],
            year: req.params.year,
            riding_num : req.params.riding_num,
            riding: riding_data,
            map_bounds: riding_bounds[req.params.year][req.params.riding_num][0]
        });
    }).catch(function (err) {
        res.send(err);
    });
})

app.listen(process.env.PORT || 3000);