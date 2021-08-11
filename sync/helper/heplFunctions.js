const axios = require('axios');


function difference (prod_arr,back_arr){   
    
    var result = {
        delete: [],
        update: [],
        create: []
    };
    
    prod_arr_paths = prod_arr.map(e => e.path);
    back_arr_paths = back_arr.map(e => e.path);

    for(let i in back_arr){
        if(!prod_arr_paths.includes(back_arr[i].path)){
            result.delete.push(back_arr[i].path);
        }
    }
    
    for(var i in prod_arr){
        
        if(!back_arr_paths.includes(prod_arr[i].path)){
            result.create.push(prod_arr[i].path);
        }

        if(back_arr.some(e => e.path === prod_arr[i].path && 
                               e.fileModtime !== prod_arr[i].fileModtime &&
                               e.fileModtime < prod_arr[i].fileModtime)){
            result.update.push(prod_arr[i].path)
        }
    }
    console.log(result)
    return result;
}

async function getInfo(server,opts) {
    try {
        const response = await axios.get('https://'+ server + process.env.GETFILEREQ,opts);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports.getDifference = difference;
module.exports.getServerInfo = getInfo;
