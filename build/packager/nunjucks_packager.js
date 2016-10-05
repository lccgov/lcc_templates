var ZipPackager = require('./zip_packager'),
    NunjucksProcessor = require('./../compiler/nunjucks_processor'),
    templateVersion = require('root-require')('package.json').version,
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    ejs = require('ejs'),
    async = require('async');

module.exports = class NunjucksPackager extends ZipPackager {
    
   constructor() {
      super();
      this.baseName = util.format("nunjucks_lcc_templates-%s", templateVersion);
      this.targetDir = path.join(this.repoRoot, "pkg", this.baseName);
    }

    processTemplate(file, cb) {
        var self = this;
        var sourceFile = path.join(this.repoRoot, "app", file);
        var targetFile = path.basename(file).substring(0, path.basename(file).indexOf('.')) + self.generatefileExtension(file);
        
        fs.mkdir(path.join(self.targetDir, path.dirname(file)), (err, folder) => {
            fs.open(path.join(self.targetDir, path.dirname(file), targetFile), 'w+', (err, fd) => {
                if(err) return cb(err);
                new NunjucksProcessor(sourceFile).process(function(err, content) {
                    if(err) return cb(err, []);
                    fs.write(fd, content, (err) => {
                        if(err) return cb(err);
                        return cb(null, []);
                    });
                });
            });
        });
    }

    generatefileExtension(fileName) {
        return ".html";
    }

    generatePackageJson(cb) {
        var self = this;

        var packageData = {
            templateAbbreviation: "nunjucks",
            templateName: "Nunjucks",
            templateVersion: templateVersion
        }

        ejs.renderFile(path.join(self.repoRoot, "source/package.json.ejs"), packageData, null, function(err, str) {
            if(err) return cb(err);
            fs.open(path.join(self.repoRoot, "pkg", self.baseName, "package.json"), 'w', (err, fd) => {   
                if(err) return cb(err);
                fs.writeFile(fd, str, function() {
                    return cb(null, []);
                });
            });
        });     
    }
}