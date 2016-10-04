var ZipPackager = require('./zip_packager'),
    SharePointProcessor = require('./../compiler/sharepoint_processor'),
    templateVersion = require('root-require')('package.json').version,
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    ejs = require('ejs'),
    async = require('async');

module.exports = class SharePointPackager extends ZipPackager {
    
   constructor() {
      super();
      this.baseName = util.format("sharepoint_lcc_templates-%s", templateVersion);
      this.targetDir = path.join(this.repoRoot, "pkg", this.baseName);
   }

    processTemplate(file, cb) {
        var self = this;
        var sourceFile = path.join(this.repoRoot, "app", file);
        var fileWithExtension = util.format('%s.%s', path.basename(file).substring(0, path.basename(file).indexOf('.')), 'master');
        fs.mkdir(path.join(self.targetDir, path.dirname(file)), (err, folder) => {
            fs.open(path.join(self.targetDir, path.dirname(file), fileWithExtension), 'w+', (err, fd) => {
                if(err) throw err;
                new SharePointProcessor(sourceFile).process(function(content) {
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
            templateAbbreviation: "sharepoint",
            templateName: "SharePoint",
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