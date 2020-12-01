/**
 * 文件系统工具
 */


const fs = require ('fs');
const assert = require('assert');
const path = require('path');
const crypto = require('crypto');

class FsUtils {
    /**
     * @desc 返回目录中的所有文件列表， e.g.: ["f:/abc/def.txt", "f://abc/123.cpp"]
     * @param {*} directory  目录名
     */
    static getFiles(directory) {
        assert.deepStrictEqual(typeof directory, "string", "directory name must be string");
        if (!fs.existsSync(directory)) { // directory is not existed, so return null
            console.log(directory + " is not existed.");
            return null;
        }
        directory = path.resolve(path.normalize(directory));
        let files = [];
        let dirQueue = [];
        dirQueue.push(directory);
        while (dirQueue.length > 0) {
            let walkDir = dirQueue.shift();
            fs.readdirSync(walkDir).forEach(p => {
                console.log("dir: ", path.join(walkDir, p));
                if (fs.statSync(path.join(walkDir, p)).isDirectory()) {
                    dirQueue.push(path.join(walkDir, p));
                    return;
                }
                files.push(path.join(walkDir, p));
            });
        }
        return files;
    }

    static getFileMd5Sync(file) {
        assert.deepStrictEqual(typeof file, "string", "file name must be string");
        let text = fs.readFileSync(file, 'utf8');
        let md5Hash = crypto.createHash('md5');
        md5Hash.update(text, "utf-8");
        return md5Hash.digest('hex');
    }

    static getFileMd5(file) {
        assert.deepStrictEqual(typeof file, "string", "file name must be string");
        return new Promise ((resolve, reject) => {
            try {
                let md5 =  crypto.createHash('md5');
                let rStream =  fs.createReadStream(file, "utf8");
                rStream.on('data', md5.update.bind(md5));
                rStream.on('end', function () {
                    resolve(md5.digest('hex'));
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     *
     * @param {*} fromDir 源目录
     * @param {*} targetDir 目录目录
     */
    static copyDirectorySync(fromDir, targetDir) {
        if (!fs.existsSync(fromDir)) {
            throw "fromDir is not existed."
        }
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }
        fromDir = path.normalize(fromDir);
        targetDir = path.normalize(targetDir);
        let files = FsUtils.getFiles(fromDir);
        files.forEach(filePath => {
            let subDir = "/";
            let relativePath = path.relative(fromDir, filePath);
            let targetFileDir = path.resolve(path.dirname(path.join(targetDir, relativePath)));
            FsUtils.copyFileSync(filePath, targetFileDir);
        });
    }


    static copyFileSync (src, target) {
        let data = fs.readFileSync(path.normalize(src));
        target = path.normalize(target);
        if (!fs.existsSync(target)) {
						let arr = target.split("\\");
						let path = arr[0];
						for (let i = 1; i < arr.length; i++){
							path = path+'\\'+arr[i];
							if (!fs.existsSync(path)){
								fs.mkdirSync(path);
							}
						}
            fs.mkdirSync(target);
        }
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
            let targetFile = path.join(target, path.basename(src));
            fs.writeFileSync(targetFile, data);
            return;
        }

        throw "target existed, but is not directory.    target is " + target;
    }
}

module.exports = FsUtils;
