const { existsSync } = require('fs');
const { resolve } = require('path');

function getEnvPath(dest) {
  const env = process.env.NODE_ENV;
  const fallback = resolve(`${dest}/development.env`);
  const filename = `${env}.env`;
  let filePath = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
    console.log('No .env file found. Proceeding to fallback.');
  } else {
    console.log(`${filename} was found.`);
  }

  return filePath;
}

function setupConfig(dest) {
  require('dotenv').config({ path: getEnvPath(dest) });
}

exports.setupConfig = setupConfig;
