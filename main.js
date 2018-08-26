const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

app.commandLine.appendSwitch('remote-debugging-port', '9223');

const file = require('./file');

let window = null;
let ipcMain = electron.ipcMain;

ipcMain.on("loadFile", function (event, arg) {
    console.log("event: loadFile.");
    file.load().then((data) => {
        let countTable = JSON.parse(data);
        event.sender.send("loadFile-reply", countTable);
    })
        .catch(() => {
            event.sender.send("failToLoad");
        });
});

ipcMain.on("saveFile", (event, arg) => {
    console.log("event: saveFile.");
    file.save(arg).then().catch(() => {
        event.sender.send("failToSave");
    })
});


app.on('ready', function () {
    window = new BrowserWindow({width: 500, height: 340,icon: path.join(__dirname,"icon_128.png") });
    window.loadURL('file://' + __dirname + '/index.html');
    //window.webContents.openDevTools();
    window.setMenu(null);
});


//不加这个的话，打包以后的应用在关闭窗口后会遗留一个进程。
app.on('window-all-closed', () => {
    app.quit()
});
