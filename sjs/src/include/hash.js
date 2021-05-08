// hash.js
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


const 	md5    = require('md5'),
		base64 = require('js-base64').Base64,
		uuid4  = require('uuid4');


module.exports = {
	md5: function(data) {
		if (typeof data === 'string')
			return md5(data);
		else
			throw new Error('HASH.md5: Argument have to be string!');
	},

	base64Decode: function(data) {
		if (typeof data === 'string')
			return base64.decode(data);
		else
			throw new Error('HASH.base64Decode: Argument have to be string!');
	},

	base64Encode: function(data) {
		if (typeof data === 'string')
			return base64.encode(data);
		else
			throw new Error('HASH.base64Encode: Argument have to be string!');
	},

	uuid4: function() {
		return uuid4();
	}
}
