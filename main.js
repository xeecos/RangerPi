const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

var SerialPort = require("serialport")
var port;
SerialPort.list(function(err,ports){
 console.log(ports)
  port = new SerialPort("/dev/ttyS0", {
    baudRate: 115200
  });
  port.on('data', function (data) {
  var s = "";
  for(var i=0;i<data.length;i++){
  	s+="0x"+data[i].toString(16)+" ";
  }
    console.log('Data: ' + s);
  });
  port.on('open', function() {
    port.write(new Buffer([0xff,0x55,4,0,1,0x1b,0x0d]), function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
    console.log('port opened');
  });
});

const {ipcMain} = require('electron')
var client;
ipcMain.on('add-client', (event, arg) => {
  client = event.sender
});
ipcMain.on('data', (event, arg) => {
  console.log("data:" + arg)
});
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'blockly/demos/mblockly/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  //mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
