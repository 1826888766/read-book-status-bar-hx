var Datastore = require('nedb');
const path = require("path");

class Sqlite {

	constructor() {
		this.filename = {
			"book": "bookshelf_book.db",
			"book_nav": "bookshelf_nav.db"
		};
		this.whereOpt = {};
		this.fieldOpt = {};
		this.tableOpt = "";
		this.db = {};
		this.db.book = new Datastore({
			filename: this.filename.book,
			autoload: true
		});
		this.db.book_nav = new Datastore({
			filename: this.filename.book_nav,
			autoload: true
		});
	}

	table(name) {
		this.tableOpt = name;
		this.whereOpt = {};
		this.sortOpt = {};
		this.fieldOpt = {};
		return this;
	}

	create(data) {
		return this.db[this.tableOpt].insert(data, function(err, newDoc) {
			if(err){
				console.log("err:", err);
				console.log("newDoc:", newDoc);
			}
		});
	}

	delete() {
		this.db[this.tableOpt].remove(this.whereOpt, {
			multi: true
		}, (err, ret) => {
			console.log("err:", err);
		});
	}

	update() {

	}

	sort(key, value) {
		if (value == 1 || value == "asc") {
			this.sortOpt[key] = 1
		} else {
			this.sortOpt[key] = -1
		}
		return this;
	}

	field(name) {
		if (typeof name === "string") {
			name = name.split(',')
		}
		for (var key in name) {
			if (name[key].split(' as ').length == 2) {
				this.fieldOpt[name[key]] = name[key].split(' as ')[1]
			} else {
				this.fieldOpt[name[key]] = 1
			}
		}
		return this;
	}

	where(field, op, value = "") {
		if (!value) {
			value = op;
			op = "=";
		}
		if (op == "=") {

		} else if (op == ">") {
			value = {
				$gt: value
			}
		} else if (op == ">=") {
			value = {
				$gte: value
			}
		} else if (op == "<") {
			value = {
				$lt: value
			}
		} else if (op == "<=") {
			value = {
				$lte: value
			}
		} else if (op == "in") {
			value = {
				$in: value
			}
		} else if (op == "!=" || op == "<>") {
			value = {
				$ne: value
			}
		} else if (op == "has") {
			value = {
				$exists: value
			}
		} else if (typeof op == "RegExp") {
			value = {
				$regex: value
			}
		} else if (["$regex", "$exists", "$ne", "$in", "$lte", "$lt", "$gte", "$gt"].search(op)) {
			var new_value = {}
			new_value[op] = value
			value = new_value;
		} else {
			throw new Error("不支持的表达式");
		}
		this.whereOpt[field] = value
		return this;
	}
	find() {
		return new Promise((resolve, reject) => {
			this.db[this.tableOpt].findOne(this.whereOpt, this.fieldOpt, function(err, row) {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			})
		});
	}

	select() {
		return new Promise((resolve, reject) => {
			this.db[this.tableOpt].find(this.whereOpt, this.fieldOpt).sort(this.sortOpt).exec(function(err, row) {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});

	}

}

module.exports = Sqlite
