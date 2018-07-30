const fs = require('fs');
const path =require('path');
const pathOfFile = path.join(process.env.APPDATA,"passkeeper.json");

module.exports = {
    load: function () {
        return new Promise(function (resolve, reject) {
            fs.readFile(pathOfFile, {encoding: "utf-8"}, (err, data) => {
                if (err) {//文件不存在就创建新的。

                    fs.writeFile(pathOfFile,'[]',(err)=>{
                        if(err){
                            reject(err);
                        } else{
                            resolve('[]');
                        }
                    });
                } else {
                    resolve(data);
                }
            });
        });
    },
    save: function (ob) {
        return new Promise((resolve, reject) => {
            let obs = JSON.stringify(ob);
            fs.writeFile(pathOfFile + ".temp",obs,{flag:"w"},(err)=>{
                if (err) {
                    reject(err);
                }else{
                    fs.unlink(pathOfFile, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            fs.rename(pathOfFile+ ".temp", pathOfFile, (err) => {
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