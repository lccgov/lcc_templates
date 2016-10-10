  var fs = require('fs'),
      path = require('path'),
      shell = require('shelljs/global'),
      util = require('util'),
      git = require('simple-git');

  module.exports = class NunjucksPublisher {

    constructor(version) {
        this.gitUrl = util.format("https://%s@github.com/lccgov/lcc_templates_nunjucks.git", process.env.GITHUBKEY);
        this.version = version;
        this.repoRoot = path.normalize(path.join(__filename, '../../..'));
        this.sourceDir = path.join(this.repoRoot, 'pkg', util.format("nunjucks_lcc_templates-%s", this.version));
    }

    publish() {
        var self = this;
        console.log("Publishing new version of lcc_templates_nunjucks to npm")
        fs.mkdtemp(path.join(this.repoRoot, "lcc_templates_nunjucks"), (err, folder) => {
            git().clone(self.gitUrl, folder, function() {
                process.chdir(folder);
                exec("ls -1 | grep -v 'readme.md' | xargs -I {} rm -rf {}");
                cp('-r', util.format('%s/*', self.sourceDir), folder);
                exec('git config --global user.email "developer@leeds.gov.uk"');
                exec('git config --global user.name "Travis CI"');
                exec("git add -A .");
                exec(util.format('git commit -q -m "Publishing LCC nunjucks templates version %s"', self.version));
                exec(util.format("git tag v%s", self.version));
                exec("git push -q --tags origin master");
                exec(util.format("echo '//registry.npmjs.org/:_authToken=\%s' > .npmrc", process.env.NPMAUTH));
                exec(util.format("echo '//registry.npmjs.org/:_password=\%s' >> .npmrc", process.env.NPMTOKEN));
                exec("echo '//registry.npmjs.org/:username=lccgov' >> .npmrc");
                exec("echo '//registry.npmjs.org/:email=developer@leeds.gov.uk' >> .npmrc");
                //exec("npm publish ./");
            })
        });
    }

    hasVersionUpdated(cb) {
        var version = util.format("v%s", this.version);
        var regex = new RegExp(version);
        git().listRemote(['--tags', util.format(this.gitUrl)], function(err, data) {
           if(err) return cb(err);
           if(data  ===  undefined) return cb(null, true);
           return cb(null, !regex.test(data));
        });
    }
}