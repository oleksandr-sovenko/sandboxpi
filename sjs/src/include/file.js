// file.js
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


const	fs   = require('fs'),
		path = require('path'),
		{ execSync } = require('child_process');


module.exports = {
	is: function(filename) {
		if (!this.exists(filename))
			return '';

		stat = fs.statSync(filename);
		if (stat.isBlockDevice())
			return 'block-device';
		if (stat.isCharacterDevice())
			return 'char-device';
		if (stat.isDirectory())
			return 'dir';
		if (stat.isFIFO())
			return 'fifo';
		if (stat.isFile())
			return 'file';
		if (stat.isSocket())
			return 'socket';
		if (stat.isSymbolicLink())
			return 'symlink';

		return '';
	},

	remove: function(filename) {
		fs.unlinkSync(filename);
	},

	exists: function(filename) {
		return fs.existsSync(path.dirname(filename));
	},

	read: function(filename) {
		var content = '';

		try {
			content = fs.readFileSync(filename);
		} catch(e) {
			content = '';
		}

		return content;
	},

	write: function(filename, data, options) {
		if (fs.existsSync(path.dirname(filename))) {
			fs.writeFileSync(filename, data, options);

			if (fs.existsSync(filename))
				execSync('sync -f "' + filename + '"');
		}
	},

	append: function(filename, data) {
		fs.appendFileSync(filename, data);

		if (fs.existsSync(filename))
			execSync('sync -f "' + filename + '"');
	},
}
