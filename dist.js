var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    wrench = require('wrench'),
    sitemap = require('./config/sitemap'),
    dir = {},
    pages;

pages = [
    '/index.html',
    '/community.html',
    '/community-3-column.html',
    '/location.html',
    '/physician-search.html',
    '/physician-details.html',
    '/interior-content.html',
    '/interior-content-3-column.html',
    '/contact.html',
    '/physician-landing.html',
    '/contact-submitted.html',
    '/interior-content-full.html',
    '/network.html',
    '/press-release.html',
    '/services.html',
    '/services-heart-vascular.html',
    '/community-detail-video.html',
    '/community-detail-news.html',
    '/community-detail-event.html',
    '/events-calendar.html',
    '/events-list.html',
    '/events-detail.html',
    '/residency-1.html',
    '/residency-2.html',
    '/ebsco.html',
    '/location-landing.html',
    '/location-search.html'
];

dir.views = __dirname + '/views';
dir.dist = __dirname + '/dist';
dir.statics = __dirname + '/public'

wrench.rmdirSyncRecursive(dir.dist);
wrench.copyDirSyncRecursive(dir.statics, dir.dist);

for (var p = 0, pl = pages.length; p < pl; p++) {
    var page = pages[p],
        viewPath = path.join(dir.views, page),
        params,
        cb;

    params = {
        page: page,
        sitemap: sitemap
    };

    cb = (function(err, html) {
        if (err) return console.log(err);

        var distPath = path.join(dir.dist, this.page);
        fs.writeFile(distPath, html);
        console.log('Writing', distPath, '...');
    }).bind(params);

    swig.renderFile(viewPath, params, cb);
}