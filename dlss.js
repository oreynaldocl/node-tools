//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

async function ListAllCSProj(myFolder) {
  let result = [];
  const files = await fsp.readdir(myFolder);
  for (const fileName of files) {
    const full = path.join(myFolder, fileName);
    const stats = await fsp.stat(full);
    if (stats.isFile()) {
      if (fileName.endsWith('.csproj')) {
        result.push(full);
      }
    } else {
      const tempRes = await ListAllCSProj(full);
      result = [...result, ...tempRes];
    }
  }

  return result;
}

async function GetDlls(csProjs) {
  let myMap = new Map();
  for (const proj of csProjs) {
    const data = await fsp.readFile(proj, 'utf8');
    const splitted = data.split('\n');
    for (let line of splitted) {
      const startAt = line.indexOf('..\\');
      const endAt = line.indexOf('.dll');
      if (startAt === -1 || endAt === -1) {
        continue;
      }
      line = line.substring(startAt, endAt + 4);
      line = line.replace(/..\\/g, '');
      if (line.length > 0 && !myMap[line]) {
        myMap.set(line, true);
      }
    }
  }
  return Array.from(myMap.keys());
}

async function WriteToFile(currentFolder, dlls) {
  const file = path.join(currentFolder, 'dlls.ps1');
  let content = "echo \"Downloading dlss\"\n";
  for (const dll of dlls) {
    content += `tf get "${dll}"\n`;
  }
  console.log(content);
  await fsp.writeFile(file, content);
}

async function main(currentFolder, toAnalyze) {
  const startMs = new Date().getMilliseconds();
  const analyze = path.join(currentFolder, toAnalyze);
  let csProjs = await ListAllCSProj(analyze);
  for (let index = 0; index < csProjs.length; index++) {
    console.log(`${index} - ${csProjs[index]}`);
  }
  let dlls = await GetDlls(csProjs);
  await WriteToFile(currentFolder, dlls);
  const taken = new Date().getMilliseconds() - startMs;
  console.log(`It takes: ${taken} ms`);
}

// ~  node .\dlss.js root
const folder = process.argv[2];
const currentFolder = __dirname;
main(currentFolder, folder );
