 var AssetProcessor = require('./build/compiler/asset_processor'),
     NunjucksPackager = require('./build/packager/nunjucks_packager'),
     SharePointPackager = require('./build/packager/sharepoint_packager'),
     util = require('util'),
     templateVersion = require('root-require')('package.json').version,    
     pathExists = require('path-exists'),
     rmdir = require('rmdir'),
     fs = require('fs'),
     path = require('path');

task('default', ['compile'])

desc("Compile template and assets from ./source into ./app")
task ('compile', function() {
  console.log("Compiling assets and templates into ./app")
  new AssetProcessor().process(function() { jake.Task['clean'].invoke(); });
}) 

desc("Clean pkg directory")
task ('clean', function() {
   var currentPath = path.dirname(path.normalize(__filename));
   pathExists(path.join(currentPath, 'pkg')).then(exists => {
     if(exists) {
       console.log('Removing pkg folder')
       rmdir(path.join(currentPath, 'pkg'), function(err, dirs, files) {
         fs.mkdir(path.join(currentPath, 'pkg'), (err, folder) => {
           if(err) throw err;
           jake.Task['build'].invoke();
         })
       });
     } else {
        fs.mkdir(path.join(currentPath, 'pkg'), (err, folder) => {
          if(err) throw err;
          jake.Task['build'].invoke(); 
        })
     }
   });
})

desc("Build both nunjucks and SharePoint versions")
task('build', ["build:nunjucks", "build:sharepoint"])

namespace("build", function() {
  desc("Build sharepoint_lcc_templates into the pkg directory")
    task("sharepoint", function() {
      console.log(util.format("Building pkg/sharepoint_lcc_templates-%s", templateVersion))
      new SharePointPackager().package();
  });
  desc("Build nunjucks_lcc_templates into the pkg directory")
    task("nunjucks", function() {
      console.log(util.format("Building pkg/nunjucks_lcc_templates-%s", templateVersion))
      new NunjucksPackager().package();
  });
});
 

