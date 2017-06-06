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
            signin: '<a href="#" class="signin"><span>Sign in</span></a>', 
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
            layout_pageContent:'{% block pageContent %}{% endblock %}',
            layout_editPanel:'{% block editPanel %}{% endblock %}',
            layout_end_body: '{% endblock %}',
            application_css: '{% block css_register %}{% endblock %}',
            layout_reuserblecontent_footer:'{% block reuserblecontent_footer %}{% endblock %}',
            layout_additional_page_scripts:'{% block additional_page_scripts %}{% endblock %}',
            logo: '<a href="pages/default.aspx" class="logo img-responsive"><span></span></a>',
            layout_alerts:'{% block layout_alerts %}{% endblock %}',
            cdn_top:'    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" /><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" /><script src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script><script sr="//cdn.jsdelivr.net/respond/1.4.2/respond.min.js"></script>',
            cdn_bottom:'<script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js" type="text/javascript"></script><script src="//cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.0.0/jquery-migrate.min.js" type="text/javascript"></script><script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" type="text/javascript"></script><script src="//static.atgsvcs.com/js/atgsvcs.js" type="text/javascript"></script>  '  
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
                return util.format('<link rel="stylesheet" href="{{ asset_path }}stylesheets/%s?%s" />', file, query_string)
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