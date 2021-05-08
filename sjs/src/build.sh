# build.sh
# Copyright (c) 2020 Oleksandr Sovenko (info@oleksandrsovenko.com)

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


CWD=$(pwd)

npm i -g pkg@4.5.1
npm i -g node-gyp

# modules
cd ${CWD}/modules/core
mkdir -p ${CWD}/../modules
npm i
npm i node-addon-api
node-gyp configure && node-gyp rebuild && \
cp ${CWD}/modules/core/build/Release/core.node \
   ${CWD}/../modules/core.node

# build sjs
cd ${CWD}
npm i
pkg -t node12.2.0-linux-armv7 -o ${CWD}/../bin/sjs-node12.2.0-linux-armv7-1.0 app.js
cd ${CWD}/../bin
ln -svf /opt/sjs/bin/sjs-node12.2.0-linux-armv7-1.0 /usr/bin/sjs

# build @serialport
cd ${CWD}/node_modules/@serialport/bindings && \
node-gyp configure && node-gyp rebuild && \
cp ${CWD}/node_modules/@serialport/bindings/build/Release/bindings.node ${CWD}/../bin
