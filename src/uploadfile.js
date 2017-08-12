const fs = require('fs')
const datetime = require('date-and-time')

const base_path = __dirname.replace( /\/src/g, '') + '/uploads'

const fileUpload = {
    upload: function(fileToUpload){

        var name = fileToUpload.hapi.filename
            .replace(/\\/g, '')
            // .replace(/\./, '-')
            .replace(/ /, '-')

        var now = datetime.format(new Date(), 'YYYY-MM-DD-HH-mm-ss')
        var path = base_path + "/photos/" + now + '-' + name
        var file = fs.createWriteStream(path)

        file.on('error', function (err) {
            console.error(err)
        })

        fileToUpload.pipe(file)

        fileToUpload.on('end', function (err) {
            console.log('file uploaded !')
        })
        return path;
    }
}

export default fileUpload