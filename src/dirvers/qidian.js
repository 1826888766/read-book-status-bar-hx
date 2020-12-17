var get = require("../http.js").get;
var iconv = require("iconv-lite");
class QiDian {
	constructor() {
		this._list = []
		this.navlist = []
		this.name = "";
	}

	async list(item) {
		const $ = await get(item.link, 'UTF-8').catch((err) => {
			console.log(err);
		});
		let list = [];
		// @ts-ignore
		$(".volume-wrap li a").each(function(i, elem) {
			list[i] = {
				// @ts-ignore
				title: $(this).text(),
				// @ts-ignore
				link: 'https:' + $(this).attr("href"),
			};
		});
		this._list = list;
		return list;
	}

	async read(item) {
		const $ = await get(item.link, 'UTF-8').catch((err) => {
			console.log(err);
		});
		return $(".main-text-wrap .read-content").text();
	}

	async search(name) {
		this.name = encodeURIComponent(name);
		let url =
			"https://www.qidian.com/search?kw=" +
			this.name;
		const $ = await get(url, 'UTF-8').catch((err) => {
			console.log(err);
		});
		let list = [];
		// @ts-ignore
		$('#result-list .book-img-text ul li').each(function(i, elem) {
			// @ts-ignore

			list[i] = {
				// @ts-ignore
				title: $(this).find("h4").text(),
				// @ts-ignore
				link: 'https:' + $(this).find("h4 a").attr("href") + '#Catalog',
			};
		});
		this.navlist = list;
		return list;
	}
}
module.exports = new QiDian();
