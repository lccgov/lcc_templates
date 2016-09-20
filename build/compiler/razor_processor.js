var TemplateProcessor = require('./template_processor')

class RazorProcessor extends TemplateProcessor
{
    constructor(file)
    {
        super(file);
    }

    handlePlaceholder(placeholder) {
        var hash = {
            PageTitle: '@PageTitle',
            SearchBox: '@RenderSection("search")',
            TopNavigationNoFlyoutWithStartNode: '@RenderSection("navigation")',
            ContentPlaceHolderMain: '@RenderBody',
            FooterNavigationNoFlyoutWithStartNode: '@RenderSection("footer")'
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