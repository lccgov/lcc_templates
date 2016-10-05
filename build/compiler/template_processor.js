var fs = require('fs'),
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

    get generateFileExtension() {
        throw Error("Not implemented on base"); 
    }

    asset_path(file) {
        throw Error("Not implemented on base"); 
    }

    process(cb) {
        console.log('Generating ' + this.templateEngine + ' template from ' + this.fileName);
        ejs.renderFile(this.fileName, this.placeholders, null, function(err, str) {
            if(err) return cb(err, null);
            cb(null, str);
        });     
    }
}

module.exports = TemplateProcessor; 