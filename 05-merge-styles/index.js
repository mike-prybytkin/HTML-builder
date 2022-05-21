const fs = require('fs');
const path = require('path');

//remove bundle.css
fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), () => {});

async function createBundle() {
  fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  const data = await fs.promises.readdir(path.join(__dirname, 'styles'));

  data.forEach((file) => {
    fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
      if (err) console.log(err);
      if (stats.isFile() && path.extname(file) === '.css') {
        //--- read and add styles in bundle
        const stream = fs.createReadStream(
          path.join(__dirname, 'styles', file),
          'utf-8'
        );

        let cssData = '';

        stream.on('data', (chunk) => (cssData += chunk));
        stream.on('end', () => {
          //append CSS in bundle.css
          fs.appendFile(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            cssData,
            (err) => {
              if (err) throw err;
            }
          );
          //---
        });
      }
    });
  });
  console.log('\n bundle.css created!\n Check project-dist folder!');
}

try {
  createBundle();
} catch (error) {
  console.log(error);
}
