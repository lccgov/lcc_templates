var TemplateProcessor = require('./template_processor')

class NunjucksProcessor extends TemplateProcessor
{
    constructor(file)
    {
        super(file);
    }

    handlePlaceholder(placeholder) {
        var hash = {
            PageTitle: '{% block page_title %}{% endblock %}',
            SearchBox: '{% include "includes/search_global.html" %}',
            TopNavigationNoFlyoutWithStartNode: '{% include "includes/nav_global.html" %}',
            ContentPlaceHolderMain: '{% block bodycontent %}{% endblock %}',
            FooterNavigationNoFlyoutWithStartNode: '{% include "includes/footer_global.html" %}'
        }

        return hash[placeholder];
    }

    get templateEngine() {
       return "nunjucks";
    }

    get fileExtension() {
        return ".html";
    }
}

module.exports = NunjucksProcessor; 