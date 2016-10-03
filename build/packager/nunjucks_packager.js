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

   package() {
        var self = this;
        fs.mkdir(this.targetDir, (err, folder) => {
            async.series([function(cb) {
                self.prepareContents(cb) }, 
            function(cb) { 
                self.generatePackageJson(cb) },
            function(cb) {
                self.createZip(cb)
            }])        
        });
    }

    processTemplate(file, cb) {
        var self = this;
        var sourceFile = path.join(this.repoRoot, "app", file);
        fs.mkdir(path.join(self.targetDir, path.dirname(file)), (err, folder) => {
            fs.open(path.join(self.targetDir, file), 'w+', (err, fd) => {
                    if(err) throw err;
                    new NunjucksProcessor(sourceFile).process(function(content) {
                        fs.writeFile(fd, content, function() {
                            cb(null, []);
                        })
                    });
                });
        });
    }

    generatePackageJson(cb) {
        var self = this;

        var packageData = {
            templateAbbreviation: "nunjucks",
            templateName: "Nunjucks",
            templateVersion: templateVersion
        }

        ejs.renderFile(path.join(self.repoRoot, "source/package.json.ejs"), packageData, null, function(err, str) {
            if(err) throw err;
            fs.open(path.join(self.repoRoot, "pkg", self.baseName, "package.json"), 'w', (err, fd) => {   
                if(err) throw err;
                fs.writeFile(fd, str, function() {
                    cb(null, []);
                });
            });
        });     
    }
}