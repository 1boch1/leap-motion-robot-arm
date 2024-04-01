# Robot arm controller

I made this code to control a 3D printed robot arm I built using:

- Arduino
- Nema 17 - stepper motors
- CNC-Shield
- A4988 stepper motor driver
- Leap Motion Controller v1 (first version)

## Libraries

- [leapjs](https://github.com/leapmotion/leapjs)
- [serialport](https://www.npmjs.com/package/serialport)

## Preview

I made a brief YouTube video to show the project:

[![YouTube video](https://img.youtube.com/vi/iXWfNFAuq_E/0.jpg)](https://www.youtube.com/watch?v=iXWfNFAuq_E)

## Diagram

![Diagramma senza titolo-3](https://github.com/1boch1/leap-motion-robot-arm/assets/69087218/2a3eb270-5d93-443f-8cae-609876ee1f5b)

## How to use

- Install the Leap Motion software (use v2.3.1 you find under "Legacy Downloads" on the Leap Motion offcial website)
- Open the software and check the "Allow Web Apps" checkbox to turn on the WebSocket server that provides tracking data to web applications
- Use leapjs to connect to Leap Motion with JavaScript
- Setup your Arduino with GRBL
- Connect to Arduino using Serial Communication (serialport.js library)
- Now you can send GCODE to Arduino based on the data you receive from the Leap Motion

⚠ IF YOU ARE USING WINDOWS 10:

There is a bug in the Leap Motion software on Windows 10, here is how I fixed it:

https://forums.leapmotion.com/t/resolved-windows-10-fall-creators-update-bugfix/6585 


## Project setup

- #### Install the dependencies running this command

  ### `npm install`
  
- #### Start the app running this command

  ### `npm start`

