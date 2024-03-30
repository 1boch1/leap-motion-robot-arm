const Leap = require('leapjs');
const { SerialPort } = require('serialport')

// available ports
SerialPort.list().then(ports =>
{
  ports.forEach(function (port)
  {
    console.log(port.path);
  })
})

let port = new SerialPort({
  path: 'COM4',  // find the path of your port and put it here
  baudRate: 115200,
});

// open errors will be emitted as an error event
port.on('error', function (err)
{
  console.log('Error: ', err.message);

  // alternative path
  port = new SerialPort({
    path: 'COM3',
    baudRate: 115200,
  })
})

var controller = new Leap.Controller()

controller.on('ready', function ()
{
  console.log("ready");
});
controller.on('connect', function ()
{
  console.log("connect");
});
controller.on('disconnect', function ()
{
  console.log("disconnect");
});
controller.on('focus', function ()
{
  console.log("focus");
});
controller.on('blur', function ()
{
  console.log("blur");
});
controller.on('deviceConnected', function ()
{
  console.log("deviceConnected");
});
controller.on('deviceDisconnected', function ()
{
  console.log("deviceDisconnected");
});

controller.connect();
console.log("\nWaiting for device to connect...");

/////////////////////////
// Robot arm controls //
////////////////////////

var pos = null; // position of the hand in the current frame
var lastPos = null; // position of the hand in the last frame

var start = false; // start tracking

var thr = 0.0004; // threshold to ingore micro movements

Leap.loop(function (frame)
{
  if (frame.hands?.length <= 0) return; // if there are no hands in the scene

  pos = frame.hands[0]?.palmPosition; // get the position of the hand (the first hand)
  if (!pos) return;

  let n_fingers = frame?.fingers?.filter(f => f.extended).length; // get the number of extended fingers

  // show 3 fingers to start controlling the robot arm
  if (n_fingers == 3)
  {
    start = true;
    lastPos = pos; // setup lastPos
  }

  if (!start) return;

  let [z, x, y] = pos;
  let [lz, lx, ly] = lastPos;

  let moveX = (lx - x) / 4000;

  if (Math.abs(moveX) >= thr) port.write('G20G91G1X' + moveX + 'F250\n\r', (err) =>
  {
    if (err) console.log('Error on write: ', err.message)
  });

  let moveY = (ly - y) / 3000;

  if (Math.abs(moveY) >= thr) port.write('G20G91G1Y' + moveY + 'F250\n\r', (err) =>
  {
    if (err) return console.log('Error on write: ', err.message)
  });

  let moveZ = (lz - z) / 2000;

  if (Math.abs(moveZ) >= thr) port.write('G20G91G1Z' + moveZ + 'F250\n\r', function (err)
  {
    if (err) return console.log('Error on write: ', err.message)
  });

  lastPos = pos; // update last position
});