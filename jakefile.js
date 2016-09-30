 var AssetProcessor = require('./build/compiler/asset_processor'),
     NunjucksPackager = require('./build/packager/nunjucks_packager'),
     SharePointPackager = require('./build/packager/sharepoint_packager'),
     util = require('util'),
     templateVersion = require('root-require')('package.json').version;

task('default', ['compile'])

desc("Compile template and assets from ./source into ./app")
task ('compile', function() {
  console.log("Compiling assets and templates into ./app")
  new AssetProcessor().process(function() { jake.Task['build'].invoke(); });
}) 

desc("Build both nunjucks and SharePoint version")
task('build', ["build:nunjucks", "build:sharepoint"])

namespace("build", function() {
  desc("Build nunjucks_lcc_templates into the pkg directory")
    task("nunjucks", function() {
      console.log(util.format("Building pkg/nunjucks_lcc_templates-%s", templateVersion))
      new NunjucksPackager().package();
  });
  desc("Build sharepoint_lcc_templates into the pkg directory")
    task("sharepoint", function() {
      console.log(util.format("Building pkg/sharepoint_lcc_templates-%s", templateVersion))
      new SharePointPackager().package();
  });
});
 

