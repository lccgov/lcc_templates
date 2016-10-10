 var AssetProcessor = require('./build/compiler/asset_processor'),
     NunjucksPackager = require('./build/packager/nunjucks_packager'),
     SharePointPackager = require('./build/packager/sharepoint_packager'),
     NunjucksPublisher = require('./build/publisher/nunjucks_publisher'),
     SharePointPublisher = require('./build/publisher/sharepoint_publisher'),
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
      new SharePointPackager().package(function() {
         jake.Task['publish:sharepoint'].invoke(); 
      });
  });
  desc("Build nunjucks_lcc_templates into the pkg directory")
    task("nunjucks", function() {
      console.log(util.format("Building pkg/nunjucks_lcc_templates-%s", templateVersion))
      new NunjucksPackager().package(function() {
         jake.Task['publish:nunjucks'].invoke(); 
      });
  });
});

namespace("publish", function() {
  desc("Publishing sharepoint templates if version updated")
    task("sharepoint", function() {
      console.log("Publishing sharepoint templates if version updated")
       var publisher = new SharePointPublisher(templateVersion);
       publisher.hasVersionUpdated(function(err, updated) {
          if(err) throw err;
          if(updated) {
             // publisher.publish();
          } else {
              console.log("sharepoint templates version has not been updated so skipping")
         }
       });
  });

  desc("Publishing nunjucks templates if version updated")
    task("nunjucks", function() {
    console.log("Publishing nunjucks templates if version updated")
       var publisher = new NunjucksPublisher(templateVersion);
       publisher.hasVersionUpdated(function(err, updated) {
          if(err) throw err;
          if(updated) {
             // publisher.publish();
          } else {
              console.log("nunjucks templates version has not been updated so skipping")
          }
       });
    });
});
 
 

