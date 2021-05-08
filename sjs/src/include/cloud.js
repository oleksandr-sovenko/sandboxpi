// cloud.js
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


const 	MATH         = require('./math'),
		EventEmitter = require('events'),
 		https        = require('https');


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
			https.get('https://api.artjs.org/api/profile/' + id, options, function(res) {
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
	    const response = await got('https://api.artjs.org/api/devices', {
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
	    const response = await got.put('https://api.artjs.org/api/notification', {
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
		hostname: 'api.artjs.org',
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
					const response = await got('https://api.artjs.org/api/profile/' + id, {
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


module.exports = { CLOUD };