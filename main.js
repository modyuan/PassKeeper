const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var window = null;



app.on('ready', function() {
    window = new BrowserWindow({width: 500, height: 400,icon : __dirname+"/imgs/icon.ico"});
    window.loadURL('file://' + __dirname + '/index.html');
    //window.webContents.openDevTools();
    window.setMenu(null)
});