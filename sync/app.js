require('dotenv').config();

const express = require('express');
const app = express();

const func = require('./helper/heplFunctions');

app.get('/sendData', async (req,res)=> {
    
    let serversInfo = {
        prod: {},
        back: {}
    }
    
    serversInfo.back = await func.getServerInfo(`localhost:${process.env.BACKPORT}`);
    serversInfo.prod = await func.getServerInfo(`localhost:${process.env.PRODPORT}`);
    
    result = func.getDifference(serversInfo.prod, serversInfo.back);
    
    res.send(result);
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening port ${process.env.PORT}`);
})