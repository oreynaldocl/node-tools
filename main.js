//requiring path and fs modules
const path = require('path');
const fs = require('fs');

// CODE 
function CleanFiles(folder, prefix) {
  console.log('### Cleaning folder ' + folder);
  fs.readdir(folder, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
  
    files.forEach((file) => {
      let newName = RenameFromFile(file, "Voz humana (192kbit_AAC)");
      newName = RenameFromFile(newName, "Audiolibro Sanderson");
      newName = RenameFromFile(newName, "Capítulos");
      newName = RenameFromFile(newName, "Capítulo");
      newName = RenameFromFile(newName, "capítulos");
      newName = RenameFromFile(newName, "capítulo");
      newName = RenameFromFile(newName, prefix);

      fs.rename(`${folder}\\${file}`, `${folder}\\${newName}`, function(err) {
        if ( err ) console.log(`ERROR: not renamed to "${folder}\\${newName}"\n` + err);
      });

    });
  })
}

function RenameFromFile(fileName, remove) {
  let newName = fileName.replace(remove, '');

  const ext = newName.split('.').pop();
  newName = newName.replace(`.${ext}`, '');

  newName = newName.replace(/\s+/g, ' ').trim();

  return `${newName}.${ext}`;
}

function AddPrefix(folder, prefix) {
  console.log(`### Adding Prefix ${prefix} to ${folder}`);
  fs.readdir(folder, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
  
    files.forEach((file) => {
      let newName = `${prefix}${file}`;

      fs.rename(`${folder}\\${file}`, `${folder}\\${newName}`, function(err) {
        if ( err ) console.log(`ERROR: not renamed to "${folder}\\${newName}"\n` + err);
      });

    });
  })
}

const myFolder = `E:\\OSCAR\\Downloads\\Archivos 4 El Ritmo de la Guerra`;
const prefix = "El Ritmo de la Guerra";
//CleanFiles(myFolder, prefix);
AddPrefix(myFolder, `${prefix} `);

//AddPrefix(myFolder, `${"0"}`);
