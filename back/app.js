require('dotenv').config();
const express = require('express');
const app = express();

const hfunc = require('./helper/helpFunction');
const fileFunc = require('./helper/func_for_files/filesFunctions');

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

app.listen(process.env.PORT,()=>{
      console.log(`Server listening port ${process.env.PORT}`)
})