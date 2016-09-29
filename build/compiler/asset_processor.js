var path = require('path'),
    fs = require('fs'),
    pathExists = require('path-exists'),
    rmdir = require('rmdir'),
    mkpath = require('mkpath'),
    spawn = require('child_process').spawn,
    _ = require('lodash'),
    glob = require('glob'),
    manifest = require('../../manifest.json'),
    util = require('util'),
    sass = require('node-sass'),
    Mincer = require('mincer'),
    async = require('async');

module.exports = class AssetProcessor
{
    constructor() {    
        this.repoRoot = path.normalize(path.join(__filename, '../../..'));
        this.buildDir = path.join(this.repoRoot, "app");
        this.stylesheetAssets = [];
        this.staticAssets = []
    }

    isWin() {
        return /^win/.test(process.platform);
    } 

    compileJavascripts() {
        var self = this;
        
        var env = new Mincer.Environment(this.repoRoot);
        env.appendPath("source/assets/javascripts");

        _.forEach(manifest.javascripts, function(javascript) {
            
            var asset = env.findAsset(javascript)
            if(asset == undefined) {
                throw Error(util.format("Asset %s cannot be found", javascript));
            }

            var targetFile = path.join(self.buildDir, 'assets', 'javascripts', path.basename(asset.pathname))

            fs.open(targetFile, 'w', (err, fd) => {
                if(err) throw err;

                fs.writeFile(fd, asset.toString(), (err) => {
                    if (err) throw err;
                });
            });            
        });
    }

    compileStylesheets(){
        var self = this;
        
        var env = new Mincer.Environment(this.repoRoot);   
        env.appendPath("source/assets/stylesheets");
        env.appendPath("node_modules/lcc_frontend_toolkit/stylesheets"); 

        var stylesheetAssets = []; 

        env.ContextClass.defineAssetPath(function (pathname, options) {
            stylesheetAssets.push(pathname);
            return 'images/' + pathname;
        });

        _.forEach(manifest.stylesheets, function(stylesheet) {
            var asset = env.findAsset(stylesheet);

            if(asset === undefined) {
                throw Error(util.format("Asset %s cannot be found", stylesheet));
            }

            var targetFile = path.join(self.buildDir, 'assets', 'stylesheets', asset.logicalPath)

            fs.open(targetFile, 'w', (err, fd) => {
                if(err) throw err;

                fs.writeFile(fd, asset, (err) => {
                    if (err) throw err;
                });
            });        
        });

        self.stylesheetAssets = _.uniq(stylesheetAssets);
    }

    copyStaticAssets() {     
        var self = this;   
        var excludedExtensions = [".js", ".css", ".scss", ".ejs", ".html"];

        var source = path.join(this.repoRoot, "source", "assets");
        var dest = path.join(this.buildDir, 'assets');

        process.chdir(source);

        var filesToCopy = [];

        var files = glob.sync('**/*', { cwd: source });
        _.forEach(files, function(file) {
            if(fs.lstatSync(file).isDirectory(file) || (excludedExtensions.indexOf(path.extname(file)) > -1)) {
                return;
            }
            filesToCopy.push(file); 
        });

        if(this.isWin()) {
           spawn('robocopy', [source, dest, "/MIR", "/XD", "javascripts", "stylesheets", "/XF"]
                                            .concat(_.map(excludedExtensions, (item) => util.format("*%s", item))));
        } else{
            spawn('cp', ['-r --parents', filesToCopy.join(" "), dest]);           
        }

        // strip leading path component to get logical path as referenced in stylesheets
        this.staticAssets = _.map(filesToCopy, function(file) {
             return file.replace(/[^\/]+\//, '');
        });
    }

    copyNeededToolkitAssets() {
        var self = this;

        var neededAssets = _.difference(this.stylesheetAssets, this.staticAssets);

        if(neededAssets.length === 0) {
            return
        }

        var env = new Mincer.Environment(this.repoRoot);   
        env.appendPath("node_modules/lcc_frontend_toolkit/img"); 

        _.forEach(neededAssets, function(assetName) {
            var asset = env.findAsset(assetName);

            if(asset === undefined) {
              throw Error(util.format("Asset %s cannot be found", assetName));
            }

            // move the images into the stylesheets folder so they are relative to the stylesheets which call them
            var targetFile = path.join(self.buildDir, 'assets', 'stylesheets', 'images', asset.logicalPath);
            fs.mkdir(path.join(self.buildDir, 'assets', 'stylesheets', 'images'), function() {
                fs.open(targetFile, 'w+', (err, fd) => {
                    if(err) throw err;

                    fs.writeFile(fd, asset, (err) => {
                        if (err) throw err;
                    });
                });
            }); 
        });
    }

    copyViews() {
        var self = this;

        var source = path.join(this.repoRoot, "source", "views");
        var dest = path.join(self.buildDir, 'views');
                
        var filesToCopy = [];

        process.chdir(source);

        var files = glob.sync('**/*', { cwd: source });
        _.forEach(files, function(file) {
            if(fs.lstatSync(file).isDirectory(file)) {
                return;
            }
            filesToCopy.push(file);
        });
           
        var copy = self.isWin() ? spawn('robocopy', [source, dest].concat(filesToCopy)) :
                        spawn('cp', ['-r --parents', filesToCopy.join(" "), dest]);      
    }

    createBuildDir() {
        var self = this;
        pathExists(this.buildDir).then(exists => {
            if(exists) {
                //rmdir(self.buildDir, function (err, dirs, files) {
                    mkpath.sync(path.join(self.buildDir, "assets", "stylesheets"));
                    mkpath.sync(path.join(self.buildDir, "assets", "javascripts"));
                    mkpath.sync(path.join(self.buildDir, "views"));
                //});
            } else {
                mkpath.sync(path.join(self.buildDir, "assets", "stylesheets"));
                mkpath.sync(path.join(self.buildDir, "assets", "javascripts"));
                mkpath.sync(path.join(self.buildDir, "views"));
            }
        });
    }

    process(task){
        var self = this;
        this.createBuildDir();
        async.parallel([function() {self.compileJavascripts()}, function() {self.compileStylesheets()},
            function() { self.copyViews() }, function() { self.copyStaticAssets() }, 
            function() { self.copyNeededToolkitAssets() }], function(err, results) {
                task.complete();
        })
    }
}
