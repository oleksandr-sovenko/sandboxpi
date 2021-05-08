// dir.js
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
		path = require('path');


module.exports = {
	exists: function(filename) {
		if (typeof filename === 'string')
			return fs.existsSync(path.dirname(filename));
		else
			throw new Error('DIR.exists: Argument have to be string!');
	},

	list: function(directory) {
		if (typeof directory === 'string') {
			var dirs  = [],
				files = [];

			if (fs.existsSync(directory)) {
				fs.readdirSync(directory).forEach(function(filename) {
					var stat = fs.statSync(directory + '/' + filename);

					if (stat.isDirectory())
						dirs.push({
							name      : filename,
							type      : 'dir',
							created_at: stat.atime,
							updated_at: stat.mtime,
							size      : stat.size,
						});
					else
						files.push({
							name      : filename,
							type      : 'file',
							created_at: stat.atime,
							updated_at: stat.mtime,
							size      : stat.size,
						});
				});
			}

			return dirs.concat(files);
		} else
			throw new Error('DIR.list: Argument have to be string!');
	},

	create: function(directory) {
		if (typeof directory === 'string')
			fs.mkdirSync(directory, { recursive: true });
		else
			throw new Error('DIR.create: Argument have to be string!');
	},

	remove: function(directory) {
		if (typeof directory === 'string') {
			var list;

			list = fs.readdirSync(directory);
			for (var i = 0; i < list.length; i++) {
				var filename = path.join(directory, list[i]),
					stat = fs.statSync(filename);

				if(filename == '.' || filename == '..') {
					// pass these files
				} else if(stat.isDirectory()) {
					// rmdir recursively
					this.remove(filename);
				} else {
					// rm fiilename
					fs.unlinkSync(filename);
				}
			}

			fs.rmdirSync(directory);
		} else
			throw new Error('DIR.remove: Argument have to be string!');
	}
};
