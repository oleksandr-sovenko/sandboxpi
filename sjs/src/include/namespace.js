// namespace.js
// Copyright (C) 2020 Oleksandr Sovenko (info@oleksandrsovenko.com)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


const	CONFIG       = require('../config'),
		fs           = require('fs'),
		md5          = require('md5'),
		base64       = require('js-base64').Base64,
		path         = require('path'),
		uuid4        = require('uuid4'),
		https        = require('https'),
		moment       = require('moment'),
		// fastify      = require('fastify')({ logger: false }),
		{ execSync } = require('child_process'),
		EventEmitter = require('events'),
		WebSocket    = require('ws'),
		got          = require('got'),
		// SerialPort   = require('serialport'),
		// Readline     = require('@serialport/parser-readline'),
		{ GPIO, BMP280, HC_SC04 } = require('../modules/core');


// namespace CLOUD {
	const CLOUD = new EventEmitter();
	CLOUD.profileInfo = {};
	CLOUD.profileData = {};
	CLOUD.auth = function(token) {
		if (!/^[a-z0-9]+$/.test(token)) {
			CLOUD.emit('error', '"token" must have symbols only a-z and 0-9.');
			return false;
		}

		CLOUD.token = token;

		return true;
	};

	CLOUD.listenProfile = function(id) {
		CLOUD.profileInfo[id] = { nextRun: true };

		CLOUD.profileInfo[id].timer = setInterval(function() {
			var pInfo   = CLOUD.profileInfo[id],
				options = {
    				headers: {
	 					'Authorization': CLOUD.token,
	 					'Status': 'none',
    				}
				};

			if (pInfo.nextRun) {
				pInfo.nextRun = false;
				https.get(CONFIG.url.cloud + '/api/profile/' + id, options, function(res) {
					res.on('data', function(body) {
						try {
							body = JSON.parse(body.toString());
						} catch(e) {
							body = undefined;
						}

						try {
							if (body !== undefined && body.data !== undefined && body.data.id !== undefined && body.data.data !== undefined) {
								var profile = body.data.id,
									json    = body.data.data;

								if (CLOUD.profileData[id] === undefined)
									CLOUD.profileData[id] = {};

								for (var variable in json) {
									if (CLOUD.profileData[id][variable] === undefined) {
										CLOUD.emit('data', variable, json[variable].value);
									} else {
										if (CLOUD.profileData[id][variable] !== json[variable].value)
											CLOUD.emit('data', variable, json[variable].value);
									}

									CLOUD.profileData[id][variable] = json[variable].value;
								}
							}
						} catch(err) {
							// LOG.append(err.stack);
						}

						setTimeout(function() {
							pInfo.nextRun = true;
						}, MATH.randInt(2, 4) * 1000);
					});
				}).on('error', function(e) {
					setTimeout(function() {
						pInfo.nextRun = true;
					}, MATH.randInt(2, 4) * 1000);
				});
			}
		}, 1000);
	};

	CLOUD.getDevices = async function(callback) {
		(async function() {
		    const response = await got(CONFIG.url.cloud + '/api/devices', {
		        responseType: 'json',
	        	headers: {
					'Authorization': CLOUD.token,
					'Status': 'none',
				},
		    });

		 	if (typeof callback === 'function')
				callback(response.body.data);
		})();
	}

	CLOUD.sendNotification = function(uuid, title, body, callback) {
		(async function() {
		    const response = await got.put(CONFIG.url.cloud + '/api/notification', {
		        json: { uuid: uuid, title: title, body: body },
		        responseType: 'json',
	        	headers: {
					'Authorization': CLOUD.token,
					'Status': 'none',
				},
		    });

		 	if (typeof callback === 'function')
				callback(response.body.data);
		})();
	};

	CLOUD.sendEmail = function(to, data) {

	};

	CLOUD.sendSMS = function(to, data) {

	};

	CLOUD.setProfile = async function(id, data, callback) {
		data = JSON.stringify(data);

		const options = {
  			hostname: CONFIG.url.cloud.replace('https://', ''),
  			port: 443,
  			path: '/api/profile/' + id,
  			method: 'POST',
  			headers: {
				'Authorization': CLOUD.token,
				'Status': 'none',
    			'Content-Type': 'application/json',
  			},
		}

		const req = https.request(options)
		// req.on('error', (error) => {
		// 	// console.error(error);
		// })
		req.write(data);
		req.end();
	};

	CLOUD.getProfile = async function(id, callback) {
		if (arguments.length == 2) {
			if (typeof id === 'string' && typeof callback === 'function') {
				(async () => {
					try {
						const response = await got(CONFIG.url.cloud + '/api/profile/' + id, {
					    	responseType: 'json',
							headers: {
								'Authorization': CLOUD.token,
								'Status': 'none',
							},
						});

						callback(response.body);
					} catch(err) {
						callback(undefined);

						// LOG.append(err.stack);
					}
				})();
			} else
			    throw new Error('CLOUD.getProfile: Argument have to be string and function!');
		} else
			throw new Error('CLOUD.getProfile: Too few arguments!');
	};
// }


// namespace MATH {
	const MATH = {
		randInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) ) + min;
		}
	}
// }



// namespace W1 {
	const W1 = {
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
// }



