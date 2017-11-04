import fileHelper from '../lib/filehelper'
import introDao from '../dao/introduction'

const introduction = {
    getIntro: async (request, reply) => {
        try{
            var intro = await introDao.get()
            reply({
                intro:intro
            })
        }catch(err){
            reply(err)
        }
    },
    setIntro: async (request, reply) => {

        console.log('set intro')
        const intro = request.payload

        if (!entity.file) {
            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.uploadIntroFile(entity.file)


        try {
            var result = await introDao.set(entity, path)
            reply(result)
        }
        catch (err) {
            reply(err)
        }
    }
}

export default introduction