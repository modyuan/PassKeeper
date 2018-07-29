const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.commandLine.appendSwitch('remote-debugging-port', '9223');

const file = require('./file');

let window = null;
let ipcMain = electron.ipcMain;

ipcMain.on("loadFile",function(event,arg){
    console.log("event: loadFile.");
    file.load().then((data)=>{
        let countTable=JSON.parse(data);
        event.sender.send("loadFile-reply",countTable);
    })
        .catch(()=>{
            event.sender.send("failToLoad");
        });
});

ipcMain.on("saveFile",(event,arg)=>{
    console.log("event: saveFile.");
    file.save(arg).then().catch(()=>{
        event.sender.send("failToSave");
    })
});


app.on('ready', function() {
    window = new BrowserWindow({width: 500, height: 400,icon : __dirname+"/imgs/icon.ico"});
    window.loadURL('file://' + __dirname + '/index.html');
    //window.webContents.openDevTools();
    window.setMenu(null);




});