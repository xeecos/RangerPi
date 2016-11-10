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
    if(client){
    	var bytes = []
    	for(var i=0;i<data.length;i++){
    		bytes.push(data[i]);
    	}
    	console.log("received:",bytes);
    	client.send('data',bytes);
    }
  });
  port.on('open', function() {
    console.log('port opened');
  });
  port.on('close', function() {
    console.log('port closed');
    port.open();
  });
});

const {ipcMain} = require('electron')
var client;
ipcMain.on('add-client', (event, arg) => {
  client = event.sender
});
ipcMain.on('data', (event, data) => {
  console.log("data:" + data)
  port.write(new Buffer(data), function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('data written');
    });
});
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 768})
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
