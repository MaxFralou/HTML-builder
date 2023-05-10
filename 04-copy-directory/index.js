const fs = require('fs');
const path = require('path');

const { promises: fsPromises } = fs;

const copyDirPath = path.join(__dirname, 'files-copy');
const readDirPath = path.join(__dirname, 'files');

async function copyDir(src, dest) {
  try {
    await fsPromises.rm(dest, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  await fsPromises.mkdir(dest, { recursive: true });

  const files = await fsPromises.readdir(src, { withFileTypes: true });
  files.forEach(async (file) => {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  });
}

copyDir(readDirPath, copyDirPath)
  .then(() => {
    console.log('Копирование папки завершено успешно. Поздравляю!');
  })
  .catch((err) => {
    console.error('Ой:', err);
  });
