var TemplateProcessor = require('./template_processor'),
    templateVersion = require('root-require')('package.json').version,
    path = require('path'),
    util = require('util');

class NunjucksProcessor extends TemplateProcessor
{
    constructor(file) {
        super(file);
    }

    get placeholders() {
        var hash = {
            before_html: '',
            html_start_tag: '<html>',
            head_end: '<title>{% block page_title %}{% endblock %}</title>',
            head_attribute: '',
            body_attribute: '',
            body_start: '',
            search_box: '{% include "includes/search_global.html" %}',
            main_nav: '{% include "includes/nav_global.html" %}',
            body_content: '{% block bodycontent %}{% endblock %}',
            footer_nav: '{% include "includes/footer_global.html" %}',
            body_end: '',
            html_end_tag: '</html>',
            asset_path: this.asset_path
        }

        return hash;
    }

    asset_path(file) {
        var query_string = templateVersion;
        switch(path.extname(file)) {
            case '.css':
                return util.format("{{ asset_path }}stylesheets/%s?%s", file, query_string)
            case '.js':
                return util.format("{{ asset_path }}javascripts/%s?%s", file, query_string)
            default:
                return util.format("{{ asset_path }}images/%s?%s", file, query_string)
        }
   }

    get templateEngine() {
       return "nunjucks";
    }

    get fileExtension() {
        return ".html";
    }
}

module.exports = NunjucksProcessor; 