const fs = require('fs');
const path = require('path');

const dirStyles = path.join(__dirname, 'styles');
const styleArr = [];

fs.readdir(dirStyles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      const filePathCss = path.join(dirStyles, file.name);
      if (path.extname(filePathCss) === '.css') {
        const readFile = fs.createReadStream(filePathCss, 'utf-8');
        styleArr.push(readFile);
      }
    }
  });

  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const writeStream = fs.createWriteStream(bundlePath);

  writeStream.on('finish', () => {
    console.log('Bundle записан успешно, спасибо за проверку ;)');
  });

  writeStream.on('error', (err) => {
    console.error(`Ой, у нас ошибка: ${err}`);
  });

  styleArr.forEach((file) => {
    file.pipe(writeStream);
  });
});
