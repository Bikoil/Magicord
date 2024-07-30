const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const jsExtension = '.js';
const tsExtension = '.ts';

const filesToConvert = [
  'index.js',
  'deploy-commands.js',
  'commands/utility/ban.js',
  'commands/utility/echo.js',
  'commands/utility/embedmsg.js',
  'commands/utility/kick.js',
  'commands/utility/pingcheck.js',
  'commands/utility/user.js'
];

function convertFile(filePath) {
  const tsFilePath = filePath.replace(jsExtension, tsExtension);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Replace `require` with `import`
  const updatedContent = content
    .replace(/const (\w+) = require\('(.*)'\);/g, 'import $1 from \'$2\';')
    .replace(/module.exports = /g, 'export default ');

  fs.writeFileSync(tsFilePath, updatedContent);
  fs.unlinkSync(filePath);
}

function convertFiles() {
  filesToConvert.forEach((file) => {
    const filePath = path.join(projectRoot, file);
    convertFile(filePath);
  });

  console.log('Conversion complete!');
}

// Update package.json scripts
function updatePackageJson() {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.scripts.build = "tsc";
  packageJson.scripts.start = "node dist/index.js";
  packageJson.scripts.deploy = "node dist/deploy-commands.js";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

convertFiles();
updatePackageJson();
