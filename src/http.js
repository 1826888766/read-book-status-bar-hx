var url = require("url");
var cheerio = require("cheerio");
var iconv = require("iconv-lite");
function get(urls,decode="GBK") {
  return new Promise((resolve, reject) => {
    var options = url.parse(urls);
    var http;
    if(urls.search('http://') !== -1){
       http = require("http");
    }else{
      http = require("https");
    }

    var req = http.request(options, function (res) {
      let html = "";
      res.on("data", (data) => {
        html += iconv.decode(data, decode);
      });
      res.on("end", () => {
        resolve(cheerio.load(html));
      });
    });

    req.on("error", function (e) {
      console.log("problem with request: " + e.message);
    });

    req.end();
  }).catch((err) => {
    console.log("problem with request: " + err.message);
  });
}

module.exports = {
	get:get
}