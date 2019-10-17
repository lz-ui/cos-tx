'use strict'
const COS = require('cos-nodejs-sdk-v5');
const uuid = require('node-uuid');
const fs = require('fs')
const path = require('path');

class LzCos{
    constructor(config){
        if(!config.filePath ) return 
        
        // 要上传的本地文件路径
        this.filePath =  path.join(config.filePath)

        const uId = uuid.v4().split('-')[4]
        const myDate = new Date();
        const date = `${myDate.getFullYear()}${(Math.floor(myDate.getMonth())+1)}${myDate.getDate()}${myDate.getHours()}${myDate.getMinutes()}${myDate.getSeconds()}`

        // 远端路径
        this.remoteFile = `/lz-ui/cos/${date}/${uId}/`
        
        // 初始化
        this.cos = new COS({
            SecretId: 'AKIDqWx96rljrnY5NQRsENHyQceXCmBK2yPb',
            SecretKey: '82g7JI1UgjeKp67tPBl6GExQecNwFI9k'
        });

        this.init()
    }

    // 初始化
    init(){
        this.fileDisplay(this.filePath)
    }

    // 上传文件
    uploadFile(localFile) {
        // 需要填写本地路径，云存储路径
        let remoteFile =  `${this.remoteFile}${localFile}` // 云存储中的路径
        this.cos.putObject({
            Bucket: 'cos-1251140835',
            Region: 'ap-shanghai',
            Key: remoteFile,  // 云存储路径
            Body: fs.createReadStream(localFile), // 本地路径
        }, function (err, data) {
            console.log(err || 'https://'+ data.Location);
        });
    }
    
    //文件遍历方法
    fileDisplay(filePath){
        let _this = this
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath,function(err,files){
            if(err){
                console.warn(err)
            }else{
                //遍历读取到的文件列表
                files.forEach(function(filename){
                    //获取当前文件的绝对路径
                    let filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir,function(eror, stats){
                        if(eror){
                            console.warn('获取文件stats失败');
                        }else{
                            let isFile = stats.isFile();//是文件
                            let isDir = stats.isDirectory();//是文件夹
                            if(isFile){
                                _this.uploadFile(filedir.replace(/\\/g,'/'))
    　　　　　　　　　　　　　　　 // 读取文件内容
                                // let content = fs.readFileSync(filedir, 'utf-8');
                                // console.log(content);
                            }
                            if(isDir){
                                _this.fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                });
            }
        });
    }
}




