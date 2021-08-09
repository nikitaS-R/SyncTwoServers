const fs = require('fs');

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
              
              file = { path: filename, 
                       fileSize: fileSize,
                       fileModtime: fileModtime
                    }
              
              files_.push(file);
          }
      }
      return files_;
};



module.exports.getFilesInfo = getFilesInfo;