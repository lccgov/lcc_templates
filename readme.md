# lcc templates

A collection of templates to be used by Leeds City Council applications.. 

The compilation and packaging model is based on [govuk_template](https://github.com/alphagov/govuk_template), but ported to Node.js rather than using Ruby.

It contains our overarching HTML design structure (master pages) and a number of page templates (page layouts). They only contain plain HTML and EJS (Effective JavaScript) placeholders at this point, with no reference to any server-side technology such as ASP.NET server controls.  

The build process, using [Jake](http://jakejs.com) processes each of the templates and currently outputs them in two formats: 
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* SharePoint

This process could be extended to any markup language, such as [Razor](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor) by creating a new processor in the build/compiler directory of the repo and a new publisher in the build/publisher directory. 

We also include JavaScript that is fundamental for the working of all our templates/sites. We have a selection of modules located in source/assets/javascripts/modules directory that allow designers/content editors to add interaction by simply adding data attributes to HTML elements, such as data-module='carousel' for example. If you think that the piece of functionality that you are developing would be beneficial to many LCC applications, then it would be worthwhile including it in this repo.

The benefit of using this approach for creating our templates is that we are not tied into a specific vendor/technology, so if we do need to swap our CMS in the future it should be trivial to re-apply our LCC branding.

If you need to create/update a template or add/update any assets, the following steps need to be carried out:

1. Update or create a template in source/views directory or add the new asset to the relevant subdirectory under source/assets.
2. Bump version in package.json – we use [semantic versioning](http://semver.org/). NOTE: If this step is omitted, then when you commit and push your changes it will not generate new NPM packages for each of the output formats.  Helpful when you are not ready to publish a new package but want to make sure your changes are source controlled.
3. Commit changes and push to remote repository.
4. Once pushed, a [Travis CI build](https://travis-ci.org/lccgov/lcc_templates) is kicked off that checks that the version has increased and if so pushes the changes to the specific mark-up format GitHub repositories, [lcc_templates_nunjucks](https://github.com/lccgov/lcc_templates_nunjucks) and [lcc_templates_sharepoint](https://github.com/lccgov/lcc_templates_sharepoint).  Once the changes have been pushed, they are then published to the NPM registry.

The current NPM packages that are generated from this repo:
 * [lcc_templates_nunjucks](https://www.npmjs.com/package/lcc_templates_nunjucks)
 * [lcc_templates_sharepoint](https://www.npmjs.com/package/lcc_templates_sharepoint)