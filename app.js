var express = require('express');
var handlebars = require('express-handlebars');

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
    res.render('past-election', { 
        mapbox_key : process.env.MAPBOX_KEY,
        js: ['past-election', 'vote-popup'],
        css: ['past-election', 'vote-popup']
    });
});

app.listen(3000);