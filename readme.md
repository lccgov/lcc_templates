# lcc templates

A collection of templates to be used by Leeds City Council applications. 

They include templates (master pages) and layouts (page layouts) that currently generate NPM packages for both [nunjucks](https://www.npmjs.com/package/lcc_templates_nunjucks) and [SharePoint](https://www.npmjs.com/package/lcc_templates_sharepoint) applications.

To publish new NPM package versions, bump the version in the package.json file.  This will kick off a [Travis CI build](https://travis-ci.org/lccgov/lcc_templates) that publishes the updated versions to the NPM registry.

The compilation and packaging model is based on [govuk_templates](https://github.com/alphagov/govuk_template), but ported to NodeJS rather than using Ruby.