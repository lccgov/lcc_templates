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
    Mincer = require('mincer');

class AssetProcessor
{
    constructor() {    
      this.repo_root = path.normalize(path.join(__filename, '../../..'));
      this.build_dir = path.join(this.repo_root, "app");
    }

    isWin() {
        return /^win/.test(process.platform);
    } 

    compile() {  
        this.compileJavascripts();
        this.compileStylesheets();
        this.copyStaticAssets();
        this.copyViews();
    }

    compileJavascripts() {
        var self = this;
        
        var env = new Mincer.Environment();
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
    
        var env = new Mincer.Environment();
        env.appendPath("source/assets/stylesheets");
        env.appendPath(path.join("node_modules", "lcc_frontend_toolkit", "stylesheets")); 
    }

    copyStaticAssets() {

    }

    copyViews() {
        var self = this;

        var source = path.join(this.repo_root, "source", "views");
        var dest = path.join(self.build_dir, 'views');
                
        process.chdir(source);

        var filesToCopy = [];

        glob('**/*', null, function(err, files) {
            _.forEach(files, function(file) {
                if(fs.lstatSync(file).isDirectory(file)) {
                    return;
                }
                filesToCopy.push(file);
            });
           
            var copy = self.isWin() ? spawn('robocopy', [source, dest].concat(filesToCopy)) :
                            spawn('cp', ['-r --parents', filesToCopy.join(" "), dest]);           
        });
    }

   prepareBuildDir(){
       var self = this;
        pathExists(this.build_dir).then(exists => {
            if(exists) {
                rmdir(self.build_dir, function (err, dirs, files) {
                   self.createBuildDir();
                   self.compile();
                });
            } else {
                self.createBuildDir();
                self.compile();
            }
      });
    }

    createBuildDir() {
        mkpath.sync(path.join(this.build_dir, "assets", "stylesheets"));
        mkpath.sync(path.join(this.build_dir, "assets", "javascripts"));
        mkpath.sync(path.join(this.build_dir, "views"));
    }
}

var ap = new AssetProcessor();
ap.prepareBuildDir();