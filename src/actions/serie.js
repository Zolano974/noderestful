import Knex from '../knex';                  //QueryBuilder
import fileHelper from '../filehelper'
import serieDao from '../dao/serie'

const serie = {
    getAllSeries: async function (request, reply) {

        try{
            var entities = await serieDao.fetchAll()

            reply({
                series: entities,
                count: entities.length,
            });

        }
        catch(err){
            reply(err)
        }

    },
    getSerieById: async function (request, reply) {
        const id = request.params.id;

       try{
            var entity = await serieDao.fetchOneById(id)

           reply(entity)
           
       }catch(err){
           reply(err)
       }
    },
    createSerie: async function (request, reply) {

        const entity = request.payload;

        if(!entity.picture){

            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.upload(entity.picture, 'series')

        try{
            var inserted = serieDao.insert(entity, path)

            reply(inserted)
        }
        catch(err){
            throw err
        }
    },
    updateSerie: async function (request, reply) {

        const id = request.params.id;
        const entity = request.payload;
        var newpicture = entity.picture

        try{
            //on récupère le path de l'ancien fichier
            var entityOldPath = await serieDao.fetchOneById(id)
            var oldpicture = entityOldPath.picture

            // //on upload le nouveau
            var path = fileHelper.upload(newpicture, 'series')

            try{
                //on modifie l'entité
                var updatedEntity = await serieDao.update(entity, id, path)
                //on supprime l'ancien fichier
                fileHelper.remove(oldpicture)
            }
            catch(err2){
                throw err2
            }
        }
        catch(err){
            reply(err)
        }

    },
    deleteSerie: async function (request, reply) {

        const id = request.params.id;

        try{
            //on supprime en base
            var deletedEntity = await serieDao.delete(id)

            //puis on supprime le fichier associé
            fileHelper.remove(deletedEntity.picture)

            reply(deletedEntity)

        }catch(err){
            reply(err)
        }
    },
}

export default serie
