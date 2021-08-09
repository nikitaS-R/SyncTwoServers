require('dotenv').config();
const zip = require('express-zip');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();

const hfunc = require('./helper/getFilesInfo');

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

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
app.listen(process.env.PORT,()=>{
    console.log(`Server listening port ${process.env.PORT}`)
})