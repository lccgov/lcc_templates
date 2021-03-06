"use strict";

var Packager = require('./packager'),
    SharePointProcessor = require('./../compiler/sharepoint_processor'),
    templateVersion = require('root-require')('package.json').version,
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    ejs = require('ejs'),
    async = require('async');

module.exports = class SharePointPackager extends Packager {
    
   constructor() {
      super();
      this.baseName = util.format("sharepoint_lcc_templates-%s", templateVersion);
      this.targetDir = path.join(this.repoRoot, "pkg", this.baseName);
   }

    processTemplate(file, cb) {
        var self = this;
        var sourceFile = path.join(this.repoRoot, "app", file);
        var targetFile = path.basename(file).substring(0, path.basename(file).indexOf('.')) + self.generatefileExtension(file);
        
        fs.mkdir(path.join(self.targetDir, path.dirname(file)), (err, folder) => {
            fs.open(path.join(self.targetDir, path.dirname(file), targetFile), 'w+', (err, fd) => {
                if(err) return cb(err);
                new SharePointProcessor(sourceFile).process(function(err, content) {
                    if(err) return cb(err, []);
                    fs.write(fd, content, (err) => {
                        if(err) return cb(err);
                        return cb(null, []);
                    })
                });
            });
         });
    }

    generatefileExtension(fileName) {
        return fileName.indexOf('.aspx') > 0 ? ".aspx" : ".master";
    }

    generatePackageJson(cb) {
        var self = this;

        var packageData = {
            templateAbbreviation: "sharepoint",
            templateName: "SharePoint",
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