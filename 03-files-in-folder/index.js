const fs = require('fs');
const path = require('path');

async function getSizeFiles() {
  const data = await fs.promises.readdir(path.join(__dirname, 'secret-folder'));

  data.forEach((file) => {
    fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
      if (err) console.log(err);
      if (stats.isFile()) {
        let fileExtension = path.extname(file);
        let fileName = path.basename(file, fileExtension);
        console.log(`${fileName} - ${fileExtension.slice(1)} - ${stats.size}b`);
      }
    });
  });
}

try {
  getSizeFiles();
} catch (error) {
  console.log(error);
}
