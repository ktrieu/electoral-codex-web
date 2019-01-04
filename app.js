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

renderTemplate = function(res, template, params) {
    var context = { customCss : [template], customJs : [template] };
    Object.assign(context, params);
    res.render(template, context);
}

app.get('/', function(req, res) {
    renderTemplate(res, 'past-election', { mapbox_key : process.env.MAPBOX_KEY });
});

app.listen(3000);