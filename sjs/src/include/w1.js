// w1.js
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


const   fs = require('fs');


module.exports = {
    _path: '/sys/bus/w1/devices',

    getDevices: function() {
        var result = [];

        if (!fs.existsSync(this._path))
            return result;

        var list = fs.readdirSync(this._path);

        for (var i in list) {
            if (fs.existsSync(this._path + '/' + list[i] + '/w1_slave'))
                result.push({ addr: list[i] });
        }

        return result;
    },

    DS18B20: function(addr) {
        this._addr = addr;

        this.getTemperatureC = function() {
            var filename = this._path + '/' + this._addr + '/w1_slave',
                value    = null;

            if (!fs.existsSync(filename))
                return value;

            try {
                value = parseFloat(fs.readFileSync(filename).toString().replace(/.*t=/s, '').trim()) / 1000;
            } catch(err) {
                return null;
            }

            return value;
        }

        this.getTemperatureF = function() {
            var value = this.getTemperatureC();

            if (value === null)
                return value;

            return (value * 1.8) + 32;
        }

        return this;
    },
}
