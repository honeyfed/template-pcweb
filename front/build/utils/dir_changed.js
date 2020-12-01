/**
 * 检查directory是否有文件变动
 */
const FsUtils = require('./fs_utils');
const path = require('path');
const fs = require('fs');

class DirectoryContentMonitor {
  constructor (dir, callback) {
    this.dir = dir;
  }

  /**
     * @return: -1: 表示没有目录；
     */
  contentChanged () {
    let self = this;

    return new Promise((resolve, reject) => {
      let files = FsUtils.getFiles(this.dir);
      if (files == null) { // no directory
        return resolve(-1);
      }
      if (files.length === 0) { // no files
        return resolve(-2);
      }
      if (!fs.existsSync(path.resolve(this.dir, 'md5.json'))) {
        self._initMD5File();
        return resolve(true);
      }
      this._parseMD5File().then(md5Obj => {
        md5Obj === null && resolve(true);
        if (md5Obj) {
          if (files.length !== Object.keys(md5Obj).length) {
            self._initMD5File();
            return resolve(true);
          }
          let keys = Object.keys(md5Obj);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let idx = files.indexOf(key);
            if (idx === -1) { // some files changed
              self._initMD5File();
              return resolve(true);
            }
            if (files[idx] === path.resolve(self.dir, 'md5.json')) {
              continue;
            }
            let recordMd5 = md5Obj[key];

            let currentMd5 = FsUtils.getFileMd5Sync(files[idx]);
            if (recordMd5 !== currentMd5) {
              self._initMD5File();
              return resolve(true);
            }
            if (idx === files.length - 1) {
              return resolve(false);
            }
          }
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
     *解析md5.json, 如果不存在 或者解析出错就返回 null, 正常就返回 {。。。}
     * @return : 返回 Promise
     */
  _parseMD5File () {
    let md5FilePath = path.normalize(path.resolve(this.dir, 'md5.json'));
    return new Promise(function (resolve, reject) {
      if (!fs.existsSync(md5FilePath)) {
        resolve(null);
      }

      try {
        let readStream = fs.createReadStream(md5FilePath, 'utf8');
        let jsonChunks = [];
        readStream.on('data', chunk => {
          jsonChunks.push(chunk);
        });
        readStream.on('end', (err) => {
          resolve(JSON.parse(jsonChunks.join('')));
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  }

  /**
     * write md5.json file to directory
     */
  _initMD5File () {
    let files = FsUtils.getFiles(this.dir);
    if (files.length === 0) {
      return 'done';
    }
    let md5Obj = {};
    files.forEach((file, index, array) => {
      console.log(typeof file);
      if (!(file && typeof file === 'string')) {
        return;
      }
      let md5Str = FsUtils.getFileMd5Sync(file);
      md5Obj[file] = md5Str;
      console.log(md5Str);
    });
    fs.writeFileSync(path.resolve(this.dir, 'md5.json'),
      JSON.stringify(md5Obj), 'utf8');
  }
}

module.exports = DirectoryContentMonitor;
