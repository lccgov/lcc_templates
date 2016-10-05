var path = require('path'),
    fs = require('fs'),
    util = require('util'),
    ejs = require('ejs'),
    async = require('async');

class Test {

    process(){
        var self = this;
        var repoRoot = path.normalize(path.dirname(__filename));
        var targetDir = path.join(repoRoot, "pkg", 'test');
        var sourceFile = path.join(repoRoot, "app", 'views', 'lcc-template.html.ejs');
        var targetFile = path.basename('lcc-template.html.ejs').substring(0, path.basename('lcc-template.html.ejs').indexOf('.')) + '.html';
        
        fs.mkdir(targetDir, (err, folder) => {
             if(err) throw err;
            fs.open(path.join(targetDir, targetFile), 'w+', (err, fd) => {
                if(err) throw err;
                fs.write(fd, 'test', (err) => {
                    if(err) throw err;
                });
            });
        });
    }
}

var test = new Test();
test.process();