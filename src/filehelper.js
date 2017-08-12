const fs = require('fs')
const datetime = require('date-and-time')

const upload_path = '/srv/node/restful/uploads'

const filehelper = {
    upload: function(fileToUpload, category){

        if(category !== 'photos' && category !== 'video')
            category = 'series'

        var name = fileToUpload.hapi.filename
            .replace(/\\/g, '')
            // .replace(/\./, '-')
            .replace(/ /, '-')

        var now = datetime.format(new Date(), 'YYYY-MM-DD-HH-mm-ss')
        var path = upload_path + "/"+category+"/" + now + '-' + name
        var file = fs.createWriteStream(path)

        file.on('error', function (err) {
            console.error(err)
        })

        fileToUpload.pipe(file)

        fileToUpload.on('end', function (err) {
            console.log('file uploaded !')
        })
        return path.replace(upload_path, '');
    },
    remove: function(pathToRemove){

        fs.unlink(upload_path + pathToRemove, function(err) {
            if(err && err.code == 'ENOENT') {
                // file doens't exist
                console.info("File "+pathToRemove+" doesn't exist, won't remove it.");
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
            } else {
                console.info(`file removed`);
            }
        });
    },
    getFullPath: function(path){
        return upload_path + path ;
    }
}

export default filehelper