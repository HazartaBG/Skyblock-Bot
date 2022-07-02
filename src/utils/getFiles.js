const fs = require('fs');

function getFiles(dirPath, fileArr = [], oldPath = '') {
  const data = fs.readdirSync(dirPath);

  for (const file of data) {
    const filePath = `${dirPath}/${file}`;
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      getFiles(filePath, fileArr, dirPath);
    } else {
      let extraPath = '';

      if (oldPath) {
        extraPath = dirPath.split(oldPath).filter((x) => x)[0];
      }

      fileArr.push(`${extraPath}/${file}`);
    }
  }

  return fileArr;
}

exports.getFiles = getFiles;
