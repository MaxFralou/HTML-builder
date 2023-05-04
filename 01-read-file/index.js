const { stdout } = process;

const fs = require('fs');
const path = require('path');

const text = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(text, 'utf8');

readStream.pipe(stdout);
