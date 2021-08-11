require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const https = require('https');

const hfunc = require('./helper/helpFunction');
const fileFunc = require('./helper/func_for_files/filesFunctions');

const opt = {
    key: fs.readFileSync(path.join(__dirname,'cert','server_back_key.pem')),
    cert:fs.readFileSync(path.join(__dirname,'cert','server_back_cert.pem')),
    requestCert:true,
    rejectUnauthorized:false,
    ca:[
        fs.readFileSync(path.join(__dirname,'cert','server_back_cert.pem'))
    ]
};

app.get('/getFiles',(req,res)=>{
    res.send(hfunc.getFilesInfo(process.env.allDataDIR));
});

app.get('/sync',async(req,res)=>{
    result = await hfunc.getServerInfo(`localhost:${process.env.SYNCPORT}`);

    fileFunc.deleteFile(result.delete);
    fileFunc.updateFiles(result.update);
    fileFunc.createZip(result.create);

    res.send(result);
});

let httpsServer = https.createServer(opt,app);

httpsServer.listen(process.env.PORT,()=>{
    console.log(`Server listening port ${process.env.PORT}`)
})