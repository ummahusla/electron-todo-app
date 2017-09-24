const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on("closed", () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: "Add new todo"
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on("closed", () => (addWindow = null));
}

ipcMain.on("todo:add", (event, todo) => {
	mainWindow.webContents.send("todo:add", todo);
	addWindow.close();
});

function clearTodos() {
	mainWindow.webContents.send("todo:clear");
}

const menuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "New todo",
				accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
				click() {
					createAddWindow();
				}
			},
			{
				label: "Clear todos",
				accelerator: process.platform === "darwin" ? "Command+M" : "Ctrl+M",
				click() {
					clearTodos();
				}
			},
			{
				label: "Quit",
				accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
				click() {
					app.quit();
				}
			}
		]
	}
];

if (process.platform === "darwin") {
	// Hack for MacOS to display
	// `View` section as a new element
	menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
	menuTemplate.push({
		label: "View",
		submenu: [
			{ role: "reload" },
			{
				label: "Toggle Developer Tools",
				accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+D",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}
