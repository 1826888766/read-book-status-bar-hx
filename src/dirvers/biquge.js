
var get = require("../http.js").get
var gbk = require("../util/gbk.js").WxApi;
var iconv = require("iconv-lite");
class BiQuGe {

  constructor(arg) {
     this._list = []
	  this.navlist = []
	  this.name = ""
  }

  async list(item) {
    const $ = await get(item.link).catch((err) => {
      console.log(err);
    });
    let list = [];
    // @ts-ignore
    $("dd a").each(function (i, elem) {
      list[i] = {
        // @ts-ignore
        title: $(this).text(),
        // @ts-ignore
        link: item.link + $(this).attr("href"),
      };
    });
    this._list = list;
    return list;
  }

  async read(item) {
    const $ = await get(item.link).catch((err) => {
      console.log(err);
    });
    // @ts-ignore
    return $("#content").text();
  }

  async search(name) {
	  
    this.name = gbk.encodeURIComponent(name);

    let url =
      "https://www.xbiquge.cc/modules/article/search.php?searchkey=" +
      this.name;
    const $ = await get(url).catch((err) => {
      console.log(err);
    });
    let list = [];
    // @ts-ignore
    $("#main li").each(function (i, elem) {
      // @ts-ignore
      list[i] = {
        // @ts-ignore
        title: $(this).find(".s2").text(),
        // @ts-ignore
        link: $(this).find(".s2 a").attr("href"),
      };
    });
    this.navlist = list;
    return list;
  }
}
module.exports = new BiQuGe()
