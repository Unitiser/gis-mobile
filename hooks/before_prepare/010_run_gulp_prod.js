#!/usr/bin/env node

// var child_process = require('child_process');
var spawn = require('child_process').spawn;

//kick off process
var child = spawn('gulp', ['prod']);

//spit stdout to screen
child.stdout.on('data', function (data) {   process.stdout.write(data.toString());  });

//spit stderr to screen
child.stderr.on('data', function (data) {   process.stdout.write(data.toString());  });

child.on('close', function (code) { 
    console.log("Finished with code " + code);
});