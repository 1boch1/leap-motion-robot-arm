const Leap = require('leapjs');
const { SerialPort } = require('serialport')

// available ports' paths
SerialPort.list().then(ports => {
  ports.forEach(function (port) {
    console.log(port.path);
  })
})

let port = new SerialPort({
  path: 'COM4',
  baudRate: 115200,
});

// open errors will be emitted as an error event
port.on('error', function (err) {
  console.log('Error: ', err.message);

  port = new SerialPort({
    path: 'COM3',
    baudRate: 115200,
  })
})

var controller = new Leap.Controller()

controller.on('ready', function () {
  console.log("ready");
});
controller.on('connect', function () {
  console.log("connect");
});
controller.on('disconnect', function () {
  console.log("disconnect");
});
controller.on('focus', function () {
  console.log("focus");
});
controller.on('blur', function () {
  console.log("blur");
});
controller.on('deviceConnected', function () {
  console.log("deviceConnected");
});
controller.on('deviceDisconnected', function () {
  console.log("deviceDisconnected");
});

controller.connect();
console.log("\nWaiting for device to connect...");

//////////////////////
// Robot arm controls
/////////////////////

var pos = null; // position of the hand in the current frame
var lastPos = null; // position of the hand in the last frame

var start = false;

Leap.loop(function (frame) {

  if (frame?.hands?.length <= 0) return;

  pos = frame.hands[0]?.palmPosition;
  if (!pos) return;
  
  if(!lastPos) lastPos = pos;

  let n_fingers = frame?.fingers?.filter(f => f.extended).length;

  // show 1 finger to start controlling the robot arm
  if (n_fingers == 1) {
    start = true;
    lastPos = pos;
  }

  // show 3 fingers to stop controlling the robot arm
  if (n_fingers == 3) {
    start = false;
    lastPos = pos;
  }

  if (!start) return;

  let [z, x, y] = pos;
  let [lz, lx, ly] = lastPos;

  let moveX = (lx - x)/4000;
  if(Math.abs(moveX) < 0.0001) moveX = 0;

  port.write('G20G91G1X' + moveX + 'F250\n\r', (err) => {
    if (err) console.log('Error on write: ', err.message) 
  });

  let moveY = (ly - y)/3000;
  if(Math.abs(moveY) < 0.0001) moveY = 0;

  port.write('G20G91G1Y' + moveY + 'F250\n\r', (err) => {
    if (err) return console.log('Error on write: ', err.message)
  });

  let moveZ = (lz - z)/2000;
  if(Math.abs(moveZ) < 0.0001) moveZ = 0;

  port.write('G20G91G1Z' + moveZ + 'F250\n\r', function (err) {
    if (err) return console.log('Error on write: ', err.message)
  });

  lastPos = pos; // update last position
});