const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);

      fs.stat(filePath, (error, stats) => {
        if (error) throw error;
        const { size } = stats;
        const ext = path.extname(file.name).slice(1);
        const name = path.basename(file.name, `.${ext}`);
        console.log(`${name} - ${ext} - ${size}B`);
      });
    }
  });
});
