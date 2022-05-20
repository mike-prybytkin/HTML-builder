const fs = require('fs');
const path = require('path');

async function copyDir() {
  // create directory
  await fs.promises
    .mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
    .then(function () {
      console.log('Directory created successfully');
    })
    .catch(function (err) {
      console.log(err);
    });

  const dataCopy = await fs.promises.readdir(
    path.join(__dirname, 'files-copy')
  );
  // remove all files from folder 'files-copy'
  dataCopy.forEach((fileName) => {
    fs.unlink(path.join(__dirname, 'files-copy', fileName), () => {});
  });

  //copy files
  const data = await fs.promises.readdir(path.join(__dirname, 'files'));

  data.forEach((file) => {
    fs.copyFile(
      path.join(__dirname, 'files', file),
      path.join(__dirname, 'files-copy', file),
      (err) => {
        if (err) console.log(err);
      }
    );
  });
}

try {
  copyDir();
} catch (error) {
  console.log(error);
}
