var fs = require('fs'),
    path = require('path'),
    SharePointProcessor = require('../compiler/sharepoint_processor'),
    NunjucksProcessor = require('../compiler/nunjucks_processor'),
    process = require('process'),
    glob = require('glob'),
    _ = require('lodash'),
    util = require('util'),
    spawn = require('child_process').spawn,
    templateVersion = require('root-require')('package.json').version;

module.exports = class TarPackager {
    
    constructor(){
        this.repoRoot = path.normalize(path.join(__filename, '../../..'));
        this.baseName = util.format("lcc_template-%s", templateVersion);
    }

    get compiledExtensions() {
        return [".ejs", ".master", ".aspx"];
    }

    package() {
        var self = this;
        fs.mkdtemp(path.join(this.repoRoot, "lcc_template"), (err, folder) => {
            console.log(folder);
            self.targetDir = path.join(folder, self.baseName);
            fs.mkdir(self.targetDir, function() {
                self.prepareContents()
                //self.createTarball()
            });
        }); 
    }

    prepareContents(callback) {
        var self = this;
        var files = glob.sync('**/*', {cwd: path.join(this.repoRoot, "app") });

        this.copyStaticFiles(function() {        
            process.chdir(path.join(self.repoRoot, "app"));
            _.forEach(files, function(file) {
                if(fs.lstatSync(file).isDirectory(file)) {
                    return;
                }

                if(self.compiledExtensions.indexOf(path.extname(file)) > -1) {
                    self.processTemplate(file)
                } 
            });
        });
    }

    copyStaticFiles(callback){
        var self = this;
        var copy = spawn('robocopy', [path.join(this.repoRoot, "app"), self.targetDir, "/MIR", "/XF"]
                                            .concat(_.map(self.compiledExtensions, (item) => util.format("*%s", item))));
        copy.on('exit', function (code) {
            fs.open(path.join(self.targetDir, "VERSION"), 'w', (err, fd) => {
                fs.writeFile(fd, templateVersion)
                callback();
            });
        });
    }

    processTemplate(file) {
        var sourceFile = path.join(this.repoRoot, "app", file);
        var targetDir = path.join(this.targetDir, path.dirname(file))

        fs.mkdir(targetDir, function() {
            fs.open(path.join(targetDir, path.basename(file)), 'w+', (err, fd) => {
                var processor = new NunjucksProcessor(sourceFile);
                processor.process(function(content) {
                    fs.writeFile(fd, content)
                });
            });
        });
    }

    createTarball() {
         var self = this;
         var chpath = path.normalize(path.join(this.targetDir, ".."));
         console.log('Path: ' + chpath);
         process.chdir(chpath);
         var targetPath = path.join(this.repoRoot, "pkg");
         fs.mkdir(targetPath, function() {
            var targetFile = path.join(self.repoRoot, util.format("%s.tgz", self.baseName));
            var tar = spawn('tar', ['czf', targetFile, self.baseName]);
            tar.on('exit', function (code) {
                if (code > 0) {
                    throw Error("Error creating tar")
                }
            });
         });
    }
}