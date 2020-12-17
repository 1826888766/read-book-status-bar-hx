var get = require("../http.js").get;
var iconv = require("iconv-lite");
class ZongHeng {
	constructor() {
	   this._list =[];
	    this.navlist=[];
	    this.name = "";
	}
	

  async list(item) {
    const $ = await get(item.link,'UTF-8').catch((err) => {
      console.log(err);
    });
    let list = [];
    // @ts-ignore
    $(".chapter-list li").each(function (i, elem) {
      list[i] = {
        // @ts-ignore
        title: $(this).text(),
        // @ts-ignore
        link: $(this).find('a').attr("href"),
      };
    });
    this._list = list;
    return list;
  }
  
  async read(item) {
    const $ = await get(item.link,'UTF-8').catch((err) => {
      console.log(err);
    });
    return $(".content").text();
  }

  async search(name) {
    this.name =encodeURIComponent(name);
    let url =
      "https://search.zongheng.com/s?keyword=" +
      this.name;
    const $= await get(url,'UTF-8').catch((err) => {
      console.log(err);
    });
    let list = [];
    // @ts-ignore
    $('.search-tab .search-result-list').each(function (i, elem) {
      // @ts-ignore
      list[i] = {
        // @ts-ignore
        title: $(this).find("h2").text(),
        // @ts-ignore
        link:$(this).find("h2 a").attr("href").replace("/book/",'/showchapter/'),
      };
    });
    this.navlist = list;
    return list;
  }
}

module.exports = new ZongHeng();
