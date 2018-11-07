const fs = require('fs')
const path = require('path')

function getFileSize(filePath) {
  return (fs.fstatSync(fs.openSync(filePath, 'r')).size / 1000).toFixed(1) * 1
}

function logError(info) {
  console.log(`Error: ${info}`.underline.red)
  console.log('process exit...')
  process.exit()
}
function mkdirSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

module.exports = {
  getFileSize,
  logError,
  mkdirSync
}
