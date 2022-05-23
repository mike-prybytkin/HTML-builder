const fs = require('fs');
const path = require('path');

// === working with directory ===
// create project-dist
fs.promises
  .mkdir(path.join(__dirname, 'project-dist'), { recursive: true })
  .then(function () {
    console.log('project-dist created successfully');
  })
  .catch(function (err) {
    console.log(err);
  });

// === work with index.html ===
// copy and create index.html

const replaceTag = ['{{header}}', '{{articles}}', '{{footer}}', '{{about}}'];

async function createHtmlPage() {
  await fs.copyFile(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'project-dist', 'index.html'),
    (err) => {
      if (err) console.log(err);
    }
  );
  await fs.readFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    'utf-8',
    (err, data) => {
      if (err) throw err;
      replaceTag.forEach((tag) => {
        if (data.includes(tag)) {
          fs.readFile(
            path.join(
              __dirname,
              'components',
              `${tag.slice(2, tag.length - 2)}.html`
            ),
            'utf-8',
            (err, component) => {
              if (err) throw err;
              data = data.replace(tag, component);
              fs.writeFile(
                path.join(__dirname, 'project-dist', 'index.html'),
                data,
                (err) => {
                  err;
                }
              );
            }
          );
        }
      });
    }
  );
}

try {
  createHtmlPage();
} catch (error) {
  console.log(error);
}

// === working with style.css ===
//remove style.css
fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), () => {});

async function createBundle() {
  fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
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
          //append CSS in style.css
          fs.appendFile(
            path.join(__dirname, 'project-dist', 'style.css'),
            cssData + '\n',
            (err) => {
              if (err) throw err;
            }
          );
          //---
        });
      }
    });
  });
}

try {
  createBundle();
} catch (error) {
  console.log(error);
}

// === copy assets ===

// create assets folder
fs.promises
  .mkdir(path.join(__dirname, 'project-dist/assets'), { recursive: true })
  .then(function () {})
  .catch(function (err) {
    console.log(err);
  });

async function getSizeFiles(folder = '') {
  const data = await fs.promises.readdir(
    path.join(__dirname, `assets\\${folder}`)
  );
  data.forEach((el) => {
    fs.stat(path.join(__dirname, `assets\\${folder}`, el), (err, stats) => {
      if (err) console.log(err);
      if (stats.isFile()) {
        //copy files
        fs.copyFile(
          path.join(__dirname, `assets\\${folder}`, el),
          path.join(__dirname, `project-dist/assets\\${folder}`, el),
          (err) => {
            if (err) console.log(err);
          }
        );
      } else {
        // create 'el' directory
        fs.promises
          .mkdir(path.join(__dirname, `project-dist/assets\\${el}`), {
            recursive: true,
          })
          .then(function () {})
          .catch(function (err) {
            console.log(err);
          });
        // recurseve call function
        getSizeFiles(el);
      }
    });
  });
}

try {
  getSizeFiles();
} catch (error) {
  console.log(error);
}
