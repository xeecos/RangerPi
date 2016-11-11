const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
var HID = require('node-hid');
var devices = HID.devices();
var deviceHID;
var hidMode = false;
for(var i=0;i<devices.length;i++){
	if(devices[i].product=='RF UART'){
	hidMode = true;
		deviceHID = new HID.HID(devices[i].path);
		deviceHID.on("data", onData);
	}
}
function onData(data){
	if(client){
		var bytes = []
		if(hidMode){
			if(data[0]>0){
				var len = Math.min(data.length,data[0]);
				for(var i=1;i<=len;i++){
					bytes.push(data[i]);
				}
			}
		}else{
			var len = data.length
			for(var i=0;i<len;i++){
				bytes.push(data[i]);
			}
		}
		console.log("received:",bytes);
		client.send('data',bytes);
	}
}
var SerialPort = require("serialport")
var port;

SerialPort.list(function(err,ports){
 
  port = new SerialPort("/dev/ttyS0", {
    baudRate: 115200
  });
  port.on('data', onData);
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
  if(hidMode){
  	deviceHID.write([data.length].concat(data));
  }else{
	  port.write(new Buffer(data), function(err) {
	      if (err) {
	        return console.log('Error on write: ', err.message);
	      }
	      console.log('data written');
	    });
   }
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
