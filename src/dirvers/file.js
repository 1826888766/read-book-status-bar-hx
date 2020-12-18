const path = require("path");
const Sqlite = require("../util/Sqlite.js");
const Import = require("../util/import.js");

class File{


  constructor() {
	  this._list=[];
	  this.navlist=[];
	 this. name = "";
	  this._import =  null;
    this.sqlite = new Sqlite();
  }
  async list(item, config) {
    this.name = path.basename(item.link);
    var book = await this.sqlite.table('book').where('title', this.name).find();
	
    if (book) {
      var navList = await this.sqlite.table('book_nav').where('book_id', book._id).sort('sort','asc').field('title,_id').select();
		navList =  navList.reduce((p,c,i)=>{
		p.push({
			title:c.title,
			link:c._id
		})
		  return p;
	  },[])
      return navList;
    }
    this._import = new Import({ rule: config.rule });
    await this._import.read(item.link);
    this.save(item);
    return this._import.navList;
  }

  async read(item) {
    var book = await this.sqlite.table('book').where('title', this.name).find();
    if (book) {
      book = await this.sqlite.table('book_nav').field(['content']).where('_id', item.link).find();
      return book.content;
    }
    return this._import.content[item.link];
  }

  async search(name) {
    return [];
  }
  
  clear(){
	  this.sqlite.table('book').delete();
	  this.sqlite.table('book_nav').delete();
  }

  async save(item) {
    this._import.navList;
    var create =  await this.sqlite.table('book').create({
      title: this.name,
      url: item.link,
      type: 'file',
      nav_index: 0
    });
    var book = await this.sqlite.table('book').where('title', this.name).find();
    this._import.navList.forEach((item, index) => {
      this.sqlite.table('book_nav').create({
        title: item.title,
        url: item.link,
		sort:index,
        book_id: book._id,
        content: this._import.content[index]
      });
    });
  }
}
module.exports = new File();
