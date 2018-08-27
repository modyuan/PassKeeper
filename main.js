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


ipcMain.on("pageLoaded", () => {
    window.show();
    console.log("pageLoaded");
});

let createWindow = function () {
    window = new BrowserWindow({
        width: 500,
        height: 340,
        maxWidth: 500, minWidth: 500,
        maxHeight: 340, minHeight: 340,
        show: false,
        // icon in linux can not be too large,128x128 is OK. And it will not show in dock while icon is 512x512
        icon: path.join(__dirname, "128x128.png")
    });
    window.setMenu(null);
    window.loadURL('file://' + __dirname + '/index.html');
    //window.webContents.openDevTools();


    window.on('closed', () => {
        window = null;
    });
};

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit()
});

app.on('activate', () => {
    createWindow()
});