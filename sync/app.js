require('dotenv').config();
const express = require('express');
const app = express();
const func = require('./helper/heplFunctions');
const https = require('https');
const fs = require('fs');
const path = require('path');
const agent = require('./cert/agent');

let optsProd = { httpsAgent: agent('client_sync') };
let optsBack = { httpsAgent: agent('client_back') };

const opt = {
    key: fs.readFileSync(path.join(__dirname,'cert','server_sync_key.pem')),
    cert:fs.readFileSync(path.join(__dirname,'cert','server_sync_cert.pem')),
    requestCert:true,
    rejectUnauthorized:false,
    ca:[
        fs.readFileSync(path.join(__dirname,'cert','server_sync_cert.pem'))
    ]
};

app.get('/sendData', async (req,res)=> {
    
    let serversInfo = {
        prod: {},
        back: {}
    }
    
    serversInfo.back = await func.getServerInfo(`localhost:${process.env.BACKPORT}`,optsBack);
    serversInfo.prod = await func.getServerInfo(`localhost:${process.env.PRODPORT}`,optsProd);
    
    result = func.getDifference(serversInfo.prod, serversInfo.back);
    
    res.send(result);
})

let httpsServer = https.createServer(opt,app);

httpsServer.listen(process.env.PORT,()=>{
    console.log(`Server is listening port ${process.env.PORT}`);
})