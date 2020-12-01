const pkgJson = require("../../../package.json");
const moment = require('moment');

const VERSION = pkgJson.version.split(".").join("");
/**
 * 獲得資源目錄
 * @param {boolean} isTest 是否為測試環境
 */
function getRemoteDir(isTest) {
  return ["/", isTest ? 'test-' : '',VERSION, "-", moment().format('YYYYMMDD'), "/"].join("");
}
module.exports = {
  getRemoteDir
}
