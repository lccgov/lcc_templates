 var AssetProcessor = require('./build/compiler/asset_processor'),
     TarPackager = require('./build/packager/tar_packager'),
     util = require('util'),
     templateVersion = require('root-require')('package.json').version;

task('default', ['compile', 'build'], {async: true })

desc("Compile template and assets from ./source into ./app")
task ('compile', function() {
  var task = this;
  console.log("Compiling assets and templates into ./app")
  new AssetProcessor().process(task);
}) 

desc("Build both nunjucks and SP version")
task('build', ["build:nunjucks"])

namespace("build", function() {
  desc("Build nunjucks_lcc_templates into the pkg directory")
    task("nunjucks", function() {
      console.log(util.format("Building pkg/nunjucks_lcc_templates-%s", templateVersion))
      new TarPackager().package();
  });
});
 

