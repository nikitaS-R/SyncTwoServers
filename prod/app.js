require('dotenv').config();
const zip = require('express-zip');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const https = require('https');

const hfunc = require('./helper/getFilesInfo');

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

const opt = {
    key: fs.readFileSync(path.join(__dirname,'cert','server_prod_key.pem')),
    cert:fs.readFileSync(path.join(__dirname,'cert','server_prod_cert.pem')),
    requestCert:true,
    rejectUnauthorized:false,
    ca:[
        fs.readFileSync(path.join(__dirname,'cert','server_prod_cert.pem'))
    ]
};

app.get('/getFiles',(req,res)=>{
    res.send(hfunc.getFilesInfo(process.env.allDataDIR));
});
app.get('/downloadFiles',(req,res)=>{
    let path = req.query.filepath;
    res.download(path);
});
app.post('/downloadZip',(req,res)=>{
    let body = req.body;
    body.map(e=>e.path = __dirname + e.path);
    res.zip(body);
});

let httpsServer = https.createServer(opt,app);

httpsServer.listen(process.env.PORT,()=>{
    console.log(`Server listening port ${process.env.PORT}`)
})