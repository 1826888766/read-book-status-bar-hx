var level = require('level')
const path = require("path");
class Sqlite {
    
    constructor() {
		this.filename = "bookshelf.db";
		this. whereOpt = [];
		this. fieldOpt = [];
		this. tableOpt = "";
		this.db = level(this.filename)
       this.content();
    }

	async content(){
		this.db = await new sqlite.Database(this.filename, function (e) {
		    if (e) {
				console.log(e);
		        // throw e;
		    }
		});
		console.log(this.db)
		this.db.get("SELECT * FROM book", (e) => {
		    if (e) {
		        this.db.run("CREATE TABLE book(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,type TEXT,url TEXT,nav_index INT);");
		        this.db.run("CREATE TABLE book_nav(id INTEGER PRIMARY KEY AUTOINCREMENT,book_id INT,url TEXT, title INT,content TEXT);");
		    }
		});
	}

    run(sql) {
        this.db.run(sql, function (e) {
            if (e) {
                console.log(e);
                // throw Error(e);
            }
        });
    }
    table(name) {
        this.tableOpt = name;
        this.whereOpt = [];
        this.fieldOpt = [];
        return this;
    }

    create(data) {
        var field = Object.keys(data);
        var value = [];
        Object.values(data).forEach((item) => {
            if (typeof item === "number") {
                value.push(`${item}`);
            } else {
                value.push(`"${item}"`);
            }
        });

        var sql = `INSERT INTO ${this.tableOpt}(${field}) VALUEs(${value})`;
        return this.run(sql);
    }

    delete() {

    }

    update() {

    }
    field(name) {
        if (Array.isArray(name)) {
            this.fieldOpt=  this.fieldOpt.concat(name);
        } else if (typeof name === "string") {
            this.fieldOpt = this.fieldOpt.concat(name.split(','));
        }
        return this;
    }

    where(field, op, value = "") {
        if (!value) {
            value = op;
            op = "=";
        }
        if (typeof value === "number") {
            this.whereOpt.push(`${field} ${op} ${value}`);
        } else {
            this.whereOpt.push(`${field} ${op} "${value}"`);
        }
        return this;
    }
    find() {
        return new Promise((resolve, reject) => {
            var field = this.fieldOpt.join(",") || "*";
            var where = this.whereOpt.join(" AND ");
            var sql = `SELECT ${field} FROM ${this.tableOpt} WHERE ${where};`;
            var data = this.db.get(sql, function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    select() {
        return new Promise((resolve, reject) => {
            var field = this.fieldOpt.join(",") || "*";
            var where = this.whereOpt.join(" AND ");
            if(!this.tableOpt){
                return false;
            }
            var sql = `SELECT ${field} FROM ${this.tableOpt} WHERE ${where};`;
             this.db.all(sql, function (err, row) {
                 console.log(sql);
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

    }

}

module.exports = {
	Sqlite
}