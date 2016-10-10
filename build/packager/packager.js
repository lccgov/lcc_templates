var fs = require('fs'),
    path = require('path'),
    SharePointProcessor = require('../compiler/sharepoint_processor'),
    NunjucksProcessor = require('../compiler/nunjucks_processor'),
    process = require('process'),
    glob = require('glob'),
    _ = require('lodash'),
    util = require('util'),
    spawn = require('child_process').spawn,
    templateVersion = require('root-require')('package.json').version,
    async = require('async'),
    shell = require('shelljs/global'),
    Rsync = require('rsync');

module.exports = class Packager {

    constructor() {
        this.repoRoot = path.normalize(path.join(__filename, '../../..'));
        this.baseName = util.format("lcc_templates-%s", templateVersion);
    }

    isWin() {
        return /^win/.test(process.platform);
    }

    get compiledExtensions() {
        return [".ejs"];
    }

    package(callback) {
        var self = this;
        fs.mkdir(this.targetDir, (err, folder) => {
            async.series([function(cb) {
                self.prepareContents(cb) }, 
            function(cb) { 
                self.generatePackageJson(cb) }], 
            function(err, results) {
                if(err) throw err;
                callback();
            });    
        });
    }

    prepareContents(callback) {
        var self = this;
        var files = glob.sync('**/*', {
            cwd: path.join(this.repoRoot, "app")
        });

        var contentTasks = [];
        contentTasks.push(function(cb) {
            self.copyStaticFiles(cb)
        });
        contentTasks.push(function(cb) {
            process.chdir(path.join(self.repoRoot, "app"));

            var templateTasks = [];
            _.forEach(files, function(file) {
              if (fs.lstatSync(file).isDirectory(file)) {
                    return;
              }
              
              if (self.compiledExtensions.indexOf(path.extname(file)) > -1) {
                templateTasks.push(function(cb1) {
                    self.processTemplate(file, cb1)
                });
              }
            });

            async.parallel(templateTasks, function(err, results) {
                if (err) return cb(err);
                return cb(null, []);
            })
        });

        async.series(contentTasks, function(err, results) {
            if (err) return callback(err);
            return callback(null, []);
        })
    }

    copyStaticFiles(callback) {
        var self = this;
        process.chdir(path.join(this.repoRoot, "app"));
        exec("ls -lR")

        if(this.isWin()) {
            var robocopy = spawn('robocopy', [path.join(this.repoRoot, "app"), self.targetDir, "/MIR", "/XF"].concat(_.map(self.compiledExtensions, (item) => util.format("*%s", item))));
            robocopy.on('exit', function(code) {    
                callback(null, []);
            });
        }else {
            var rsync = new Rsync().flags('avz').source(path.join(this.repoRoot, "app/")).destination(self.targetDir);
            rsync.cwd(path.join(this.repoRoot, "app"));
            rsync.exclude(_.map(self.compiledExtensions, (item) => util.format("*%s", item)));
            rsync.execute(function(error, code, cmd) {
               if(error) throw error;
               callback(null, []);
            });
        }
    }

    processTemplate(file) {
        throw Error("Not implemented on base");
    }
    
    generatePackageJson(cb) {
        throw Error("Not implemented on base");
    }
}