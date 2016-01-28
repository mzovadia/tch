var express = require('express'),
    consolidate = require('consolidate');

module.exports = function(app, config) {
    app.engine('html', consolidate.swig);
    app.set('view engine', 'html');
    app.set('view cache', false);
    app.set('views', __dirname + '/../views');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.compress());
    app.use(express.static(__dirname + '/../public'));
    app.set('env', config.env);
    app.set('rootUrl', config.rootUrl);
    app.set('usingLESS', config.usingLESS);

    app.configure('development', function() {
        require('swig').setDefaults({
            cache: false
        });
    });
};