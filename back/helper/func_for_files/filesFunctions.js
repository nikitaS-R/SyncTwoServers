const fs = require('fs');
const axios = require('axios');
const hfunc = require('../helpFunction');
const agent = require('../../cert/agent');

let opts = { httpsAgent: agent('client_back') };

//function for delete files
function deleteFile(forDelete){
    forDelete.map(path=>{
        fs.unlink(path, function(err){
            if (err) {
                console.log(err);
            } else {
                console.log(`File ${path} is deleted`);
            }
        });
    });
}

//function for update files
async function updateFiles(forCreate){
    forCreate.map(async f=>{
     try {
        hfunc.createFolder(f);
        await axios.get(`${process.env.urlDonloadFile}/?filepath=${encodeURIComponent(f)}`,opts)
                .then(function(response){
                    fs.writeFileSync(f,response.data)
                    console.log(`File ${f} is updated`)
                });
     } catch (error) {
         console.error(error);
     }
    })
}

//function for create file from ZIP
async function createZip(forCreate){
        
    let arrForZip = hfunc.convertArrZip(forCreate)
    forCreate.map(f => hfunc.createFolder(f));

    await axios({
        method: 'post',
        url: process.env.urlGetZip,
        data: arrForZip,
        responseType: "stream",
        httpsAgent: agent('client_back')
    }).then((res)=>{
          res.data.pipe(fs.createWriteStream(process.env.createPathZIP)).on('finish', async function(){
              console.log('finish download');
              hfunc.unzipFile(forCreate,arrForZip);
          });
    })
    
}


module.exports.deleteFile = deleteFile;
module.exports.updateFiles = updateFiles;
module.exports.createZip = createZip;