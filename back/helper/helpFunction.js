const fs = require('fs');
const axios = require('axios');
const shell = require('shelljs');
const decompress = require('decompress');
const StreamZip = require('node-stream-zip');

//get info about files
function getFilesInfo (dir,files_){

    files_ = files_ || [];
    var files = fs.readdirSync(dir);

    for (var i in files)
    {
      var filename = dir + '/' + files[i];
      if(fs.statSync(filename).isDirectory())
      {
        getFilesInfo(filename,files_)
      }else{
           var fileSize = fs.statSync(filename).size
           var fileModtime = fs.statSync(filename).mtime
              
           file = { 
                  path: filename, 
                  fileSize: fileSize,
                  fileModtime: fileModtime,
                  }
          
           files_.push(file);
           }
     }
      
      return files_;
};
//get info from server
async function getInfo(server) {
    try {
        const response = await axios.get('http://'+ server +process.env.sendDataReq);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
//create folder
function createFolder(dirpath){
    let dirname = ''+ dirpath;
    dirname = dirname.split('/');
    dirname.pop();
    shell.mkdir('-p',dirname.join('/'))
}
//Convert object for make Zip 
function convertToArrObject(arrPath){
    let arrForZip=[];

    arrPath.map((p)=> {
       let obj={
           path:{},
           name:{}
        }

       obj.path = p.substr(1);

       p = p.split('/');
       obj.name = p.pop();
       
       arrForZip.push(obj)
    });
    return arrForZip;
}
//Unzip file
 async function unzipFile(dataForCreate,arrForZip,filename){
   
    const zip = new StreamZip.async({ file: 'filesZ.zip' });
   
    const entries = await zip.entries();
    for (const entry of Object.values(entries)) {
        for(const a of arrForZip){
            if(a.name === entry.name){
                console.log(a.name+'==='+entry.name)
                await zip.extract(entry, '.'+a.path);
                console.log(`File ${entry} is created`)
            }
        }
    }
    // Do not forget to close the file once you're done
    await zip.close();
}
module.exports.getFilesInfo = getFilesInfo;
module.exports.getServerInfo = getInfo;
module.exports.createFolder = createFolder;
module.exports.convertArrZip = convertToArrObject;
module.exports.unzipFile = unzipFile;
