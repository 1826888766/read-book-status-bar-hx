const request = require("./util/request.js");
const hx = require("hbuilderx");
const path = require("path");
class Log {
	constructor(config) {
		this.config = config;
		this.navList = [];
		this.active = {};
		this.pageIndex = 0;
		this.activeNav = {};
		this.bookList = [];
		this.contextArr = [];
		this.isStop = false;
		this.timeout = null
	}

	listen() {

	}

	dispose() {

	}

	async search(name) {
		this.bookList = await request.setConfig(this.config).setDirvers(this.config.get("type")).search(name);
		this.bookList = this.bookList.reduce((per, cur, index) => {
			per.push({
				label: cur.title,
				description: cur.link,
				index: index
			})
			return per;
		}, [])
		this.showBookList()
	}

	setConfig(config) {
		if (this.config && this.config.get("type") != config.get("type")) {
		    this.config = config;
		    this.bookList = [];
		    this.navList = [];
		    this.navIndex = 0;
		    this.navPage = {
		        cur: 0,
		        limits: 10,
		    };
		    this.bookPage = {
		        cur: 0,
		        limits: 10,
		    };
		    this.search(this.config.get("name"));
		}
	}

	/**
	 * 更新配置
	 * @param key 
	 * @param value 
	 */
	async updateConfig(key, value) {
		await this.config
			.update(key, value.toString())
	}
	showBookList() {
		hx.window.showQuickPick(this.bookList, {
			placeHolder: "请选择书籍"
		}).then(result => {
			if (!result) {
				return;
			}
			this.active = result
			this.list()
		})
	}
	 showNavList() {
		hx.window.showQuickPick(this.navList, {
			placeHolder: "请选择书籍目录"
		}).then(result => {
			if (!result) {
				return;
			}
			this.activeNav = result
			this.navIndex = result.index
			this.read()
		})
	}

	async list() {
		if(!this.active.label){
			return hx.window.showErrorMessage('请先选择书籍');
		}
		await this.updateConfig("name", this.active.label);
		await this.updateConfig("link", this.active.description);
		this.navList = await request.setConfig(this.config).setDirvers(this.config.get("type")).list({
			link: this.active.description,
			title: this.active.label
		});

		this.navList = this.navList.reduce((per, cur, index) => {
			per.push({
				label: cur.title,
				description: cur.link,
				index: index
			})
			return per;
		}, [])
		this.showNavList()
	}

	async read(isInit = false) {
		if (!this.activeNav) {
		    this.write("请搜索书籍");
		    return;
		}
		if (!isInit) {
		    this.isStop = false;
		}
		await this.updateConfig("navIndex", this.navIndex)
		var content = await request.setConfig(this.config).setDirvers(this.config.get("type")).read({
			link: this.activeNav.description,
			title: this.activeNav.label
		})
		this.pageIndex = 0;
		this.isStop = false;
		this.contextArr = content.replace(/[(\r\n)\r\n]+/, '。').split(/[(。|！|\!|\.|？|\?)]/);
		this.inteval();
	}
	/**
     * 上一章
     */
    prePage() {
        if (this.navIndex === 0) {
            window.showWarningMessage("已是第一章");
            return;
        }

        this.pageIndex = 0;
        this.navIndex -= 1;
		this.activeNav = this.navList[this.navIndex];
        this.read();
    }
    /**
     * 下一章
     */
    nextPage() {
        if (this.navIndex >= this.navList.length - 1) {
            window.showWarningMessage("已是最后一章");
            return;
        }

        this.pageIndex = 0;
        this.navIndex += 1;
		this.activeNav = this.navList[this.navIndex];
        this.read();
    }
    /**
     * 停止/开始
     */
    stop(type = false) {
        this.isStop = type || !this.isStop;
        if (this.isStop) {
            clearTimeout(this.timeout);
        } else {
            if (!this.getContext()) {
                this.read();
            } else {
                this.inteval();
            }
        }

    }
	/**
	 * 获取分割行内容
	 */
	 getContext() {
	    return this.contextArr[this.pageIndex];
	}
	/**
	 * 下一行
	 */
	 down() {
	    let auto = this.config.get('autoReadRow');
	    if (!auto && !this.pretext) {
	        this.pageIndex++;
	    }
	    if (this.pretext) {
	        this.inteval(this.pretext);
	        this.pretext = "";
	    } else {
	        this.inteval();
	    }
	
	}
	/**
	 * 上一行
	 */
	 up() {
	    let auto = this.config("autoReadRow");
	    if (auto) {
	        this.pageIndex -= 2;
	    } else {
	        this.pageIndex--;
	    }
	    this.inteval();
	}
	
	 boss(){
	    this.stop();
	    var text = this.config.get('bosstext');
	    this.write(text);
	}
	/**
	 * 间隔执行输出
	 */
	 inteval(text = "") {
	    text = text || this.getContext();
	    let auto = this.config.get("autoReadRow");
	    if (auto) {
	        clearTimeout(this.timeout);
	        this.pageIndex++;
	    }
	    if (!auto && text === undefined) {
	        window.showErrorMessage("无章节内容，请先点击开始、或下一章");
	        return false;
	    } else if (auto && text === undefined) {
	        this.nextPage();
	        return;
	    }
	    text = text.replace(/[(.|\n)]/g, '').trim();
	    if (!text) {
	        this.down();
	        return;
	    }
	
	    let speed = this.config.get("speed",5000);
	    if (text.length < 20) {
	        speed = speed / 2;
	    }
	
	    if (text.length > this.config.get("rowLength")) {
	        this.write(text.substring(0, this.config.get("rowLength")));
	        if (this.isStop) {
	            return;
	        }
	        let nextText = text.substring(this.config.get("rowLength"));
	        this.pretext = nextText;
	        if (auto) {
	            this.timeout = setTimeout(() => {
	                this.inteval(nextText);
	            }, speed);
	        }
	
	        return;
	    }
	
	    this.write(text);
	    this.pretext = "";
	    if (this.isStop) {
	        return;
	    }
	    if (auto) {
	        this.timeout = setTimeout(() => {
	            this.inteval();
	        }, speed);
	    }
	
	}
	
	write(text){
		hx.window.setStatusBarMessage(text)
	}

	/**
	 * 初始运行
	 */
	async run() {
	    this.isStop = !this.config.get("autoRead");
	    if (this.config.get("name")) {
	        this.name = this.config.get("name");
	
	        this.active = {
	            label: this.config.get("name"),
	            description: this.config.get("link"),
	        };
	        this.navList = await request.setConfig(this.config).setDirvers(this.config.get("type")).list({
	            link: this.active.description,
	            name: this.active.label,
	        });
			console.log(this.active);
			console.log(this.navList);
			this.navList = this.navList.reduce((per, cur, index) => {
				per.push({
					label: cur.title,
					description: cur.link,
					index: index
				})
				return per;
			}, [])
	        this.activeNav = this.navList[this.config.get("navIndex")];
	        if (this.config.get("autoRead")) {
	            this.read(true);
	        }
	    } else {
	        this.write("请搜索书籍");
	    }
	}
	
	async import(file) {
	    this.selectNav = true;
	    await this.updateConfig('name',  path.basename(file));
		await this.updateConfig('link', file);
		await this.updateConfig('navIndex',0);
	    this.list();
	}
}


module.exports = {
	Log: Log
}
