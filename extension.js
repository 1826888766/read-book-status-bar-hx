var hx = require("hbuilderx");
var log = require("./src/log.js");
//该方法将在插件激活的时候调用
function activate(context) {
	var config = hx.workspace.getConfiguration("read-book-status-bar");

	var log1 = new log.Log(config)
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(log1);
	hx.workspace.onDidChangeConfiguration((e) => {
		log1.setConfig(hx.workspace.getConfiguration("read-book-status-bar"));
	});

	let search = hx.commands.registerCommand(
		"read-book-status-bar.search",
		() => {
			let inputPromise = hx.window.showInputBox({
				prompt: "请输入搜索名称",
			});
			inputPromise.then((result) => {
				log1.search(result);
				console.log("输入的密码为：", result);
			});

			// The code you place here will be executed every time your command is executed

		}
	);

	let list = hx.commands.registerCommand(
		"read-book-status-bar.list",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.list();
		}
	);

	let pre = hx.commands.registerCommand(
		"read-book-status-bar.pre",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.prePage();
		}
	);

	let next = hx.commands.registerCommand(
		"read-book-status-bar.next",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.nextPage();
		}
	);
	let stop = hx.commands.registerCommand(
		"read-book-status-bar.stop",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.stop();
		}
	);
	let start = hx.commands.registerCommand(
		"read-book-status-bar.start",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.stop();
		}
	);
	let up = hx.commands.registerCommand(
		"read-book-status-bar.up",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.up();
		}
	);
	let down = hx.commands.registerCommand(
		"read-book-status-bar.down",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.down();
		}
	);
	let bosskey = hx.commands.registerCommand(
		"read-book-status-bar.bosskey",
		() => {
			// The code you place here will be executed every time your command is executed
			log1.boss();
		});
	let _import = hx.commands.registerCommand(
		"read-book-status-bar.import",
		() => {
			var inputPromise = hx.window.showInputBox({
				prompt: "请输入txt文件的绝对路径",
			})
			inputPromise.then((result) => {
				log1.import(result);
			});

		}
	);
	context.subscriptions.push(search);
	context.subscriptions.push(list);
	context.subscriptions.push(pre);
	context.subscriptions.push(next);
	context.subscriptions.push(stop);
	context.subscriptions.push(bosskey);
	context.subscriptions.push(start);
	context.subscriptions.push(up);
	context.subscriptions.push(down);
	context.subscriptions.push(_import);

	log1.run()
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}
