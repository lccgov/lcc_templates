var TemplateProcessor = require('./template_processor')

class NunjucksProcessor extends TemplateProcessor
{
    constructor(file)
    {
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
            html_end_tag: '</html>'
        }

        return hash;
    }

    get templateEngine() {
       return "nunjucks";
    }

    get fileExtension() {
        return ".html";
    }
}

module.exports = NunjucksProcessor; 