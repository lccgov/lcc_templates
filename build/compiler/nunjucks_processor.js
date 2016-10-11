"use strict";

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
            main_nav: '{% block main_nav %}{% endblock %}',
            body_content: '{% block body_content %}{% endblock %}',
            footer_nav: '{% block footer_nav %}{% endblock %}',
            body_end: '',
            html_end_tag: '</html>',
            asset_path: this.asset_path,
            placeholder: this.placeholder,
            layout_begin_body:'{% extends "lcc-template.html" %}{% block body_content %}',
            layout_breadcrumb:'{% block breadcrumb %}{% endblock %}',
            layout_header:'{% block header %}{% endblock %}',
            layout_end_body: '{% endblock %}',
            application_css: '{% block css_register %}{% endblock %}'
        }

        return hash;
    }

    placeholder(name) {
        return util.format("{% block %s %}{% endblock %}", name);
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