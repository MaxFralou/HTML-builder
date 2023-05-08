const fs = require('fs');
const path = require('path');

const { promises: fsPromises } = fs;

const pathProjectDir = path.join(__dirname, 'project-dist');
const pathIndex = path.join(pathProjectDir, 'index.html');
const pathTemplate = path.join(__dirname, 'template.html');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathAssets = path.join(pathProjectDir, 'assets');
const readAssets = path.join(__dirname, 'assets');

const styleArr = [];

fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      const filePathCss = path.join(pathStyles, file.name);
      if (path.extname(filePathCss) === '.css') {
        const readFile = fs.createReadStream(filePathCss, 'utf-8');
        styleArr.push(readFile);
      }
    }
  });

  const pathStyle = path.join(pathProjectDir, 'style.css');

  fs.access(pathProjectDir, (err) => {
    if (err) {
      fs.mkdir(pathProjectDir, { recursive: true }, (err) => {
        if (err) throw err;
        writeStyleFile(pathStyle);
      });
    } else {
      writeStyleFile(pathStyle);
    }
  });

  function writeStyleFile(pathStyle) {
    const writeStream = fs.createWriteStream(pathStyle);
    writeStream.on('finish', () => {
      console.log('style.css записан!');
    });
    writeStream.on('error', (err) => {
      console.error(`Ой: ${err}`);
    });
    styleArr.forEach((file) => {
      file.pipe(writeStream);
    });
  }
});

fsPromises.readFile(pathTemplate, 'utf8')
  .then(async (templateData) => {
    let tempData = templateData;
    return fsPromises.mkdir(pathProjectDir, { recursive: true })
      .then(() => fsPromises.readdir(pathComponents)
        .then(async (files) => {
          const htmlFiles = files.filter((file) => path.extname(file) === '.html');
          const replace = htmlFiles.map(async (file) => {
            const tag = path.basename(file, '.html');
            const tagRegex = new RegExp(`{{${tag}}}`, 'g');
            const componentPath = path.join(pathComponents, file);

            return fsPromises.readFile(componentPath, 'utf8')
              .then((componentData) => {
                tempData = tempData.replace(tagRegex, componentData);
              })
              .catch((err) => console.log(err));
          });

          return Promise.all(replace)
            .then(() => fsPromises.writeFile(pathIndex, tempData))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err)))
      .then(() => console.log('index.html записан!'))
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

async function copyDirectory(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });

  const files = await fsPromises.readdir(src, { withFileTypes: true });
  files.forEach(async (file) => {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  });
}

copyDirectory(readAssets, pathAssets)
  .then(() => {
    console.log('assets скопирован!');
  })
  .catch((err) => {
    console.error(`Ой: ${err}`);
  });
