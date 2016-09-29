var fs = require('fs'),
    cheerio = require('cheerio'),
    ejs = require('ejs'),
    util = require('util');

class TemplateProcessor {

    constructor(fileName)
    {
        this.fileName = fileName;
    }
    
    get placeholders() {
        throw Error("Not implemented on base");
    }

    get templateEngine() {
        throw Error("Not implemented on base"); 
    }

    get fileExtension() {
        throw Error("Not implemented on base"); 
    }

    process(cb) {
        console.log('Generating ' + this.templateEngine + ' template from ' + this.fileName);
        ejs.renderFile(this.fileName, this.placeholders, null, function(err, str) {
            if(err) throw err;
            cb(str);
        });     
    }
}

module.exports = TemplateProcessor; 