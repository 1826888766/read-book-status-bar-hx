const fs = require("fs");
const path = require("path");
const os = require("os");
var iconv = require("iconv-lite");
class Import {
    
    constructor(config) {
		this. rule = /\s{0}第.{1,7}(章|节|集|卷|部|篇).{0,}/g;
		this. navList = [];
		this. content = [];
        if (config.rule) {
            this.rule =  new RegExp(config.rule,'g');
        }
        if (config.file) {
            this.read(config.file);
        }
    }

    read(file) {
        return new Promise((resolve,reject)=>{
            if(!file) {
                reject();
                return false;
            }
            var platform = os.platform();
            if (platform.search("win") !== false) {
                file = file.replace('\/', '');
            }
            var data = fs.readFileSync(file);
            var string =data.toString();
            this.praseNav(string);
            this.praseContent(string);
            resolve(this);
        });
    }

    praseNav(text) {
        var navList;
        var i=0;
        while (navList = this.rule.exec(text)) {
            this.navList.push({
                title:navList[0],
                link:i.toString()
            });
            i++;
        }
    }

    praseContent(text) {
        var content = text.split(this.rule);
        var contents = [];
        var i = -1;
        for (var key in content) {
            if (content[key].length === 1 && '章节集卷部篇'.search(content[key]) !== -1) {
                i += 1;
            }
            if (i >= 0) {
                contents[i] = content[key];
            }
        }
        this.content = contents;
    }

}

module.exports = {
	Import
}