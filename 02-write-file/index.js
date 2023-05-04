const { stdin } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'user-input.txt');

fs.writeFile(filePath, '', () => {
  console.log('Привет! Пиши что хочешь или "exit" что бы выйти:');
});

const writeData = (data) => {
  fs.appendFile(filePath, `${data}\n`, () => {
    console.log(`Записал. Пожалуйста продолжай!`);
  });
};

stdin.on('data', (input) => {
  const data = input.toString().trim();
  if (data === 'exit') {
    console.log('Удачи Bro! ;)');
    process.exit();
  } else {
    writeData(data);
  }
});

process.on('SIGINT', () => {
  console.log('\nУдачи Bro! ;)');
  process.exit();
});