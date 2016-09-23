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
    Mincer = require('mincer');

class AssetProcessor
{
    constructor() {    
        this.repo_root = path.normalize(path.join(__filename, '../../..'));
        this.build_dir = path.join(this.repo_root, "app");
        this.stylesheetAssets = [];
        this.staticAssets = []
    }

    isWin() {
        return /^win/.test(process.platform);
    } 

    copy() {  
        this.compileJavascripts();
        this.compileStylesheets();
        this.copyViews();
        this.copyStaticAssets();
        this.copyNeededToolkitAssets();
    }

    compileJavascripts() {
        var self = this;
        
        var env = new Mincer.Environment(this.repo_root);
        env.appendPath("source/assets/javascripts");

        _.forEach(manifest.javascripts, function(javascript) {
            
            var asset = env.findAsset(javascript)
            if(asset == undefined) {
                throw Error(util.format("Asset %s cannot be found", javascript));
            }

            var targetFile = path.join(self.build_dir, 'assets', 'javascripts', path.basename(asset.pathname))

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
        
        var env = new Mincer.Environment(this.repo_root);   
        env.appendPath("source/assets/stylesheets");
        env.appendPath("node_modules/lcc_frontend_toolkit/stylesheets"); 

        var stylesheetAssets = []; 
        env.registerPostProcessor('text/css', 'assetPathFinder', function (context, data) {
            var regex = / ?\<%= asset_path\('(\s*.*)'\)\s\%\>/g;
            var matches = [];
            
            while (matches = regex.exec(data)) {
               stylesheetAssets.push(matches[1]);
            }
        });

        _.forEach(manifest.stylesheets, function(stylesheet) {
            var asset = env.findAsset(stylesheet);

            if(asset === undefined) {
                throw Error(util.format("Asset %s cannot be found", stylesheet));
            }

            var targetFile = path.join(self.build_dir, 'assets', 'stylesheets', util.format("%s.ejs", asset.logicalPath))

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

        var source = path.join(this.repo_root, "source", "assets");
        var dest = path.join(this.build_dir, 'assets');

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

        // Strip leading path component to get logical path as referenced in stylesheets
        this.staticAssets = _.map(filesToCopy, function(file) {
             return file.replace(/[^\/]+\//, '');
        });
    }

    copyNeededToolkitAssets() {
        var self = this;

        var neededAssets = _.difference(this.stylesheetAssets, this.staticAssets);

        var env = new Mincer.Environment(this.repo_root);   
        env.appendPath("node_modules/lcc_frontend_toolkit/images"); 

        _.forEach(neededAssets, function(assetName) {
            var asset = env.findAsset(assetName);

            if(asset === undefined) {
              throw Error(util.format("Asset %s cannot be found", assetName));
            }

            //Move the images into the stylesheets folder so they are relative to the stylesheets which call them
            var targetFile = path.join(self.build_dir, 'assets', 'stylesheets', asset.logicalPath);

            fs.open(targetFile, 'w', (err, fd) => {
                if(err) throw err;

                fs.writeFile(fd, asset, (err) => {
                    if (err) throw err;
                });
            });     
        });
    }

    copyViews() {
        var self = this;

        var source = path.join(this.repo_root, "source", "views");
        var dest = path.join(self.build_dir, 'views');
                
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

    compile(){
        var self = this;
        pathExists(this.build_dir).then(exists => {
            if(exists) {
                rmdir(self.build_dir, function (err, dirs, files) {
                   self.createBuildDir();
                   self.copy();
                });
            } else {
                self.createBuildDir();
                self.copy();
            }
      });
    }

    createBuildDir() {
        mkpath.sync(path.join(this.build_dir, "assets", "stylesheets"));
        mkpath.sync(path.join(this.build_dir, "assets", "javascripts"));
        mkpath.sync(path.join(this.build_dir, "views"));
    }
}
