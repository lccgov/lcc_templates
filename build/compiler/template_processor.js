var fs = require('fs'),
    cheerio = require('cheerio'),
    util = require('util');

class TemplateProcessor {

    constructor(fileName)
    {
        this.fileName = fileName;
        this.folderPathFormat = "./build/package/%s/masterpages/";
    }
    
    handlePlaceholder() {
        throw Error("Not implemented on base");
    }

    get templateEngine() {
        throw Error("Not implemented on base"); 
    }

    get fileExtension() {
        throw Error("Not implemented on base"); 
    }

    process() {
        console.log('Generating ' + this.templateEngine + ' template from ' + this.fileName);
        var $ = cheerio.load(fs.readFileSync(this.fileName), {decodeEntities: false});

        //replace SPHtmlTag with html tag
        var htmlTag = $('#SPHtmlTag').wrap('<html></html>').contents();
        $('#SPHtmlTag').replaceWith(htmlTag);

        //replace SP snippets with template placeholders (nunjucks, razor etc..)
        var self = this;
        $('[data-name!=""]').each(function(i, elem) {
            $(this).replaceWith(self.handlePlaceholder($(this).data('name')))
        });

        //grab main body to remove SP ribbon
        $('body').replaceWith($('#s4-workspace'));
        $('#s4-workspace').wrap('<body></body>')

        //remove attrs from head tag
        $('head').each(function() {      
            $(this)[0].attribs = {};    
        });

        //remove server side controls
        $('[runat!=""]').each(function(i, elem) {
            $(this).remove();
        });

        //Hacky - have to load again as we need to get rid of server side cruft before html declaration
        var doc = cheerio.load($.html('html'), {decodeEntities: false});

        //prepend doctype declaration and any other template specific imports
        doc.root().prepend('<!DOCTYPE html >')
        doc('head').append(util.format('<title>%s</title>', this.handlePlaceholder('PageTitle')))
        
        return doc.root();

       // var masterPageDirectory = util.format(this.folderPathFormat, this.templateEngine);
       // if(!fs.existsSync(masterPageDirectory)){
      //      fs.mkdirSync(masterPageDirectory)
      //  }

      //  fs.writeFile(util.format("%s../%s%s", masterPageDirectory, this.fileName.substr(0, this.fileName.lastIndexOf(".")), this.fileExtension), doc.root(), function (err) {
       //     if (err) {
        //        return console.log(err);
        //    }
       // });
    }
}

module.exports = TemplateProcessor; 