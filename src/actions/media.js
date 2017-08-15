import Knex from '../knex'               //QueryBuilder
import fileHelper from '../filehelper'
import mediaDao from '../dao/media'

const media = {

    getAllMedias: async (request, reply) => {

        try {
            var medias = await mediaDao.fetchAll()

            if (!medias || medias.length === 0 || medias.error === true) {
                reply({
                    error: true,
                    errMessage: 'error while fetching medias (dao/media.js l. 13)',
                })
                return
            }

            reply({
                medias: medias,
                count: medias.length,
            })
        } catch (err) {
            reply(err);
            // reply('server-side error');
        }

    },
    getMediaById: async function (request, reply) {
        const id = request.params.id;

        try {
            var entities = await mediaDao.fetchOneById(id)

            if (!entities || entities.length === 0) {
                reply({
                    error: true,
                    errMessage: 'error while fetching media #'+id+' (dao/media.js l. 13)',
                })
                return
            }

            reply({
                medias: medias,
                count: medias.length,
            })
        } catch (err) {
            reply(err);
            // reply('server-side error');
        }

    },
    createMedia: async function (request, reply) {

        const entity = request.payload;

        if (!media.file) {
            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.upload(entity, 'medias')

        try {
            var result = await mediaDao.insert(entity, path)
            reply(result)
        }
        catch (err) {
            reply(err)
        }

    },
    updateMedia: async function (request, reply) {

        const id = request.params.id
        const entity = request.payload

        try {

            var results = mediaDao.update(entity, id)
        }
        catch (err) {
            reply(err)
        }
    },
    deleteMedia: async function (request, reply) {
        const id = request.params.id;

        try{
            var result = await mediaDao.delete(id)
            //on supprime lefichier
            fileHelper.remove(result.file)
            reply(result)
        }catch(err){
            reply(err)
        }

    },

}

export default media
