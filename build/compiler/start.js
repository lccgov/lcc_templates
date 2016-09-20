var NunjucksProcessor = require('./nunjucks_processor'),
    RazorProcessor = require('./razor_processor'),
    glob = require('glob'),
    _ = require('lodash');

glob('masterpages/*.master', null, function(err, files) {
        _.forEach(files, function(fileName) {
           var p = new NunjucksProcessor(fileName);
           p.process();

           var r = new RazorProcessor(fileName);
           r.process();
        });
});

