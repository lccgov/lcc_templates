var ZipPackager = require('./zip_packager'),
    SharePointProcessor = require('./../compiler/sharepoint_processor'),
    templateVersion = require('root-require')('package.json').version,
    path = require('path'),
    fs = require('fs'),
    util = require('util');

module.exports = class SharePointPackager extends ZipPackager {

   constructor() {
      super();
      this.baseName = util.format("sharepoint_lcc_templates-%s", templateVersion);
   }

    processTemplate(file, cb) {
        var sourceFile = path.join(this.repoRoot, "app", file);
        var targetDir = path.join(this.targetDir, path.dirname(file))

        fs.mkdir(targetDir, function() {
            fs.open(path.join(targetDir, path.basename(file)), 'w+', (err, fd) => {
                new SharePointProcessor(sourceFile).process(function(content) {
                    fs.writeFile(fd, content, function() {
                        cb(null, []);
                    })
                });
            });
        });
    }
}