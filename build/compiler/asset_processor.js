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

module.exports = class AssetProcessor {
    constructor() {
        this.repoRoot = path.normalize(path.join(__filename, '../../..'));
        this.buildDir = path.join(this.repoRoot, "app");
        this.stylesheetAssets = [];
        this.staticAssets = []
    }

    isWin() {
        return /^win/.test(process.platform);
    }

    compileJavascripts(callback) {
        console.log('Compiling Javascripts');
        var self = this;

        var env = new Mincer.Environment(this.repoRoot);
        env.appendPath("source/assets/javascripts");
        env.appendPath("node_modules/lcc_frontend_toolkit/javascripts");

        var javascriptTasks = [];
        _.forEach(manifest.javascripts, function(javascript) {

            var asset = env.findAsset(javascript)
            if (asset == undefined) {
                throw Error(util.format("Asset %s cannot be found", javascript));
            }

            var targetFile = path.join(self.buildDir, 'assets', 'javascripts', path.basename(asset.pathname))

            javascriptTasks.push(function(cb) {
                fs.open(targetFile, 'w', (err, fd) => {
                    if (err) throw err;

                    fs.writeFile(fd, asset.toString(), (err) => {
                        if (err) throw err;
                        callback(null, []);
                    });
                });
            });
        });

        async.parallel(javascriptTasks, function(err, results) {
            if (err) throw err;
            callback(null, []);
        });
    }

    compileStylesheets(callback) {
        console.log('Compiling Stylesheets');

        var self = this;

        var env = new Mincer.Environment(this.repoRoot);
        env.appendPath("source/assets/stylesheets");
        env.appendPath("node_modules/lcc_frontend_toolkit/stylesheets");

        var stylesheetAssets = [];
        env.ContextClass.defineAssetPath(function(pathname, options) {
            stylesheetAssets.push(pathname);
            return 'images/' + pathname;
        });

        var stylesheetTasks = [];
        _.forEach(manifest.stylesheets, function(stylesheet) {
            var asset = env.findAsset(stylesheet);

            if (asset === undefined) {
                throw Error(util.format("Asset %s cannot be found", stylesheet));
            }

            var targetFile = path.join(self.buildDir, 'assets', 'stylesheets', asset.logicalPath)

            stylesheetTasks.push(function(cb) {
                fs.open(targetFile, 'w', (err, fd) => {
                    if (err) throw err;
                    fs.writeFile(fd, asset, (err) => {
                        if (err) throw err;
                        cb(null, []);
                    });
                })
            });
        });

        async.parallel(stylesheetTasks, function(err, results) {
            if (err) throw err;
            self.stylesheetAssets = _.uniq(stylesheetAssets);
            callback(null, []);
        });
    }

    copyStaticAssets(callback) {
        console.log('Copying Static Assets');

        var self = this;
        var excludedExtensions = [".js", ".css", ".scss", ".ejs", ".html"];

        var source = path.join(this.repoRoot, "source", "assets");
        var dest = path.join(this.buildDir, 'assets');

        process.chdir(source);

        var filesToCopy = [];

        var files = glob.sync('**/*', {
            cwd: source
        });
        _.forEach(files, function(file) {
            if (fs.lstatSync(file).isDirectory(file) || (excludedExtensions.indexOf(path.extname(file)) > -1)) {
                return;
            }
            filesToCopy.push(file);
        });

        var copy = this.isWin() ? spawn('robocopy', [source, dest, "/MIR", "/XD", "javascripts", "stylesheets", "/XF"]
                .concat(_.map(excludedExtensions, (item) => util.format("*%s", item)))) :           
                spawn('rsync', ['-vaz', source, dest].concat(_.map(self.excludedExtensions, (item) => util.format("--exclude *%s", item))));

        copy.on('exit', function() {
            callback(null, []);
        });

        // strip leading path component to get logical path as referenced in stylesheets
        this.staticAssets = _.map(filesToCopy, function(file) {
            return file.replace(/[^\/]+\//, '');
        });
    }

    copyNeededToolkitAssets(callback) {
        console.log('Copying Needed Toolkit Assets');

        var self = this;
        var neededAssets = _.difference(this.stylesheetAssets, this.staticAssets);
        
        if (neededAssets.length === 0) {
            return callback(null, [])
        } else {
            fs.mkdir(path.join(self.buildDir, 'assets', 'stylesheets', 'images'), (err, folder) => {
                if(err) callback(err);
                var env = new Mincer.Environment(this.repoRoot);
                env.appendPath("node_modules/lcc_frontend_toolkit/img");

                var assetTasks = [];
                _.forEach(neededAssets, function(assetName) {
                    var asset = env.findAsset(assetName);

                    if (asset === undefined) {
                        throw Error(util.format("Asset %s cannot be found", assetName));
                    }

                    // move the images into the stylesheets folder so they are relative to the stylesheets which call them
                    var targetFile = path.join(self.buildDir, 'assets', 'stylesheets', 'images', asset.logicalPath);

                    assetTasks.push(function(cb) {      
                        fs.open(targetFile, 'w+', (err, fd) => {
                            if (err) throw err;
                            fs.write(fd, asset, (err) => {
                                if (err) cb(err);
                                cb(null, []);
                            });
                        });
                    });
                });

                async.parallel(assetTasks, function(err, results) {
                    if (err) throw err;
                    callback(null, []);
                });
            });
        } 
    }

    copyViews(callback) {
        console.log('Copying Views');

        var self = this;

        var source = path.join(this.repoRoot, "source", "views");
        var dest = path.join(self.buildDir, 'views');

        var filesToCopy = [];

        process.chdir(source);

        var files = glob.sync('**/*', {
            cwd: source
        });
        _.forEach(files, function(file) {
            if (fs.lstatSync(file).isDirectory(file)) {
                return;
            }
            filesToCopy.push(file);
        });

        var copy = self.isWin() ? spawn('robocopy', [source, dest].concat(filesToCopy)) : 
            spawn('rsync', filesToCopy.concat(source, dest));

        copy.on('exit', function() {
            callback(null, []);
        })
    }

    createBuildDir(callback) {
        console.log('Creating Build Dir');

        var self = this;
        async.series([
            function(cb) {
                pathExists(self.buildDir).then(exists => {
                    if (exists) {
                        rmdir(self.buildDir, function(err, dirs, files) {
                            if (err) throw err;
                            cb(null, []);
                        });
                    } else {
                        cb(null, []);
                    }
                });
            },
            function(cb) {
                self.makePath(path.join("assets", "stylesheets"), cb);
            },
            function(cb) {
                self.makePath(path.join("assets", "javascripts"), cb);
            },
            function(cb) {
                self.makePath(path.join("assets", "images"), cb);
            },
            function(cb) {
                self.makePath("views", cb);
            }
        ], function(err, results) {
            if (err) throw err;
            callback(null, results);
        });
    }

    makePath(targetPath, cb) {
        console.log('Creating path: ' + path.join(this.buildDir, targetPath));
        mkpath(path.join(this.buildDir, targetPath), function(err) {
            if (err) throw err;
            cb(null, []);
        });
    }

    process(callback) {
        var self = this;
        async.series([
                function(callback) {
                    self.createBuildDir(callback)
                },
                function(callback) {
                    self.compileJavascripts(callback)
                },
                function(callback) {
                    self.compileStylesheets(callback)
                },
                function(callback) {
                    self.copyViews(callback)
                },
                function(callback) {
                    self.copyStaticAssets(callback)
                },
                function(callback) {
                    self.copyNeededToolkitAssets(callback)
                }
            ],
            function(err, results) {
                if (err) throw err;
                callback();
            });
    }
}