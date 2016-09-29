var TemplateProcessor = require('./template_processor')

class RazorProcessor extends TemplateProcessor
{
    constructor(file)
    {
        super(file);
    }

    handlePlaceholder(placeholder) {
        var hash = {
            before_html: '',
            html_start_tag: '<html>',
            head_end: '<title>@PageTitle</title>',
            head_attribute: '',
            body_attribute: '',
            body_start: '',
            search_box: '@RenderSection("search")',
            main_nav: '@RenderSection("navigation")',
            body_content: '@RenderBody',
            footer_nav: '@RenderSection("footer-navigation")',
            body_end: '',
            html_end_tag: '</html>'
        }

        return hash[placeholder];
    }

    get templateEngine() {
       return "razor";
    }

    get fileExtension() {
        return ".cshtml";
    }
}

module.exports = RazorProcessor; 