const fs = require('fs');
const path = require('path');
const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
const pathDir = path.join(home, "PassKeeper");
const pathOfFile = path.join(pathDir, "save.json");

let funs = {
    prepare: function () {
        return new Promise((resolve, reject) => {
            fs.readdir(pathDir, (err, paths) => {
                if (!err) {
                    resolve();
                } else {
                    fs.mkdir(pathDir, (err) => {
                        if (!err) {
                            resolve()
                        } else {
                            reject(err);
                        }
                    })
                }
            });
        });
    },
    load: function () {
        return new Promise((resolve, reject)=> {
            fs.readFile(pathOfFile, {encoding: "utf-8"}, (err, data) => {
                if (err) {//文件不存在就创建新的。
                    this.prepare().then(() => { //确认目录存在
                        fs.writeFile(pathOfFile, '[]', (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve('[]');
                            }
                        });
                    })
                        .catch((err) => {
                            reject(err);
                        })
                } else {
                    resolve(data);
                }
            });
        });
    },
    save: function (ob) {
        return new Promise((resolve, reject) => {
            let obs = JSON.stringify(ob);
            fs.writeFile(pathOfFile + ".temp", obs, {flag: "w"}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    fs.unlink(pathOfFile, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            fs.rename(pathOfFile + ".temp", pathOfFile, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        }
                    })
                }
            });
        });
    }

};

module.exports = funs;