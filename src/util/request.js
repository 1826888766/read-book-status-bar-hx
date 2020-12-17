const config = {};
const dirvers = require("../dirvers/index.js");

class request {
    constructor(config) {
        this.config = config;
		this.dirvers = "biquge";
        this.dirver = dirvers[this.dirvers];
    }
    /**
     * 获取驱动
     */
    getDirvers(){
        this.dirver = dirvers[this.dirvers];
        return this;
    }
    /**
     * 设置驱动
     */
    setDirvers(name) {
        this.dirvers = name;
        return this;
    }
 /**
     * 设置配置
     */
    setConfig(config) {
        this.config = config;
        return this;
    }
    list(item){
        this.getDirvers();
       return this.dirver.list(item,this.config);
    }

    async search(name){
        this.getDirvers();
        return await this.dirver.search(name,this.config);
    }

    read(id){
        this.getDirvers();
        return this.dirver.read(id,this.config);
    }
}

module.exports = new request()
