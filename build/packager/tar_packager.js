var fs = require('fs'),
    path = require('path'),
    NunjucksProcessor = require('../compiler/nunjucks_processor'),
    process = require('process'),
    glob = require('glob'),
    _ = require('lodash'),
    util = require('util'),
    spawn = require('child_process').spawn;

class TarPackager {
    
    constructor(){
        this.repo_root = path.normalize(path.join(__filename, '../../..'));
        this.base_name = "lcc_template-1";
    }

    build() {
        var self = this;
        fs.mkdtemp("lcc_template", (err, folder) => {
            console.log(folder);
            self.target_dir = path.join(folder, self.base_name);
            fs.mkdir(self.target_dir, function() {
                self.prepareContents()
                self.createTarball()
            });
        }); 
    }

    prepareContents() {
        var self = this;
        console.log(path.join(this.repo_root, "app"));
        process.chdir(path.join(this.repo_root, "app"));
        glob('**/*', null, function(err, files) {
           _.forEach(files, function(file) {
                if(fs.lstatSync(file).isDirectory(file)) {
                    return;
                }
                if(path.extname(file) === ".master") {
                    processTemplate(file)
                } else {
                    copyFile(file);
                } 
           });

           fs.open(path.join(target_dir, "VERSION"), 'w', (err, fd) => {
                fs.writeFile(fd, '1.0')
            });
        });
    }

    copyFile(file){
        var copy = spawn('cp', ['--parents', this.target_dir, self.base_name]);
        copy.on('exit', function (code) {
            if (code > 0) {
                throw Error("Error copying")
            }
        });
    }

    processTemplate(file) {
        var target_dir = path.join(this.target_dir, path.dirname(file))
        fs.mkdir(target_dir, function() {
            var target_file = path.basename(file, path.extname(file))
            fs.open(path.join(target_dir, target_file), 'w+', (err, fd) => {
                var processor = new NunjucksProcessor(file);
                var result = processor.process();
                fs.writeFile(fd, result)
            });
        });
    }

    createTarball() {
        var self = this;
         process.chdir(path.join(this.target_dir, ".."));
         var target_path = path.join(this.repo_root, "pkg");
         fs.mkdir(target_path, function() {
            var target_file = path.join(self.repo_root, "").join(util.format("%s.tgz", self.base_name));
            var tar = spawn('tar', ['czf', target_file, self.base_name]);
            tar.on('exit', function (code) {
                if (code > 0) {
                    throw Error("Error creating tar")
                }
            });
         });
    }
}

var t = new TarPackager();
t.build();