var express = require('express');
var handlebars = require('express-handlebars');

var app = express();

app.engine('handlebars', handlebars({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use('/static', express.static('static/'));

app.get('/', function(req, res) {
    res.render('home', { mapbox_key : process.env.MAPBOX_KEY });
});

app.listen(3000);