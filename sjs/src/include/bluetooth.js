// bluetooth.js
// Copyright (c) 2020 Oleksandr Sovenko (info@oleksandrsovenko.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/*
const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('/dev/ttyS1')
const parser = new Readline()
port.pipe(parser)
parser.on('data', console.log)
//setInterval(function() {
//	port.write('ROBOT PLEASE RESPOND\n')
//}, 3000);
*/

const 	SerialPort = require('serialport'),
		Readline = SerialPort.parsers.Readline,
		EventEmitter = require('events');


const BLUETOOTH = new EventEmitter();


BLUETOOTH.connect = function(device) {
	const self = this;

	self.port   = new SerialPort(device);
	self.parser = new Readline();

	self.port.pipe(self.parser);

	self.parser.on('data', function(data) {
		var json;

		try {
			json = JSON.parse(data);
		} catch(e) {
			json = null;
		}

		self.emit('data', data);
		self.emit('dataJSON', json);
	});

	return self;
};

BLUETOOTH.write = function(data) {
	this.port.write(data + '\n');
};

BLUETOOTH.writeJSON = function(data) {
	this.port.write(JSON.stringify(data) + '\n');
};

BLUETOOTH.disconnect = function() {
	this.port.close();
};


module.exports = { BLUETOOTH };
