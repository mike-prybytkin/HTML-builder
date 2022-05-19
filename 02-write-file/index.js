const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

let output = fs.createWriteStream(path.join(__dirname, 'new-text.txt'));

stdout.write('Hello! Write something\n');

stdin.on('data', (data) => {
  if (data.toString().includes('exit')) {
    exit();
  }
  output.write(data);
});

process.on('exit', () => {
  console.log('Good bye and have a nice day!');
});

process.on('SIGINT', () => exit());
