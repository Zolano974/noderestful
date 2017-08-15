import Knex from '../knex'               //QueryBuilder
import fileHelper from '../filehelper'

const mediaDao = {

    fetchAll: async () => {

        try{
            var results = await Knex('media')
                .select(
                    'id',
                    'serie_id',
                    'title',
                    'description',
                    'mediatype',
                    'file',
                    'created',
                    'updated'
                )

            return results

        }catch (err){
            throw err
        }
    },
    fetchOneById: async (id) => {

        try{
            var results = await Knex('media')
                .where('id', id)
                .select(
                    'id',
                    'serie_id',
                    'title',
                    'description',
                    'mediatype',
                    'file',
                    'created',
                    'updated'
                )

            return results

        }catch (err){
            throw err
        }
    },
    insert: async (media, filepath) => {
        try {
            var results = await Knex('medias')
                .returning(
                    'id',
                )
                .insert(
                    {
                        serie_id: media.serieId,
                        title: media.title,
                        description: media.description,
                        file: filepath,
                        mediatype: media.mediatype,
                    }
                )

            var id = results.id

            //on renvoie le media nouvellement créé
            var media = await this.fetchOneById(id)
            return media
        }
        catch (err) {
            throw err
        }
    },
    update: async (media, id) => {
        try {

            var results = await Knex('media')
                .where('id', id)
                .update({
                    serie_id: media.serieId,
                    title: media.title,
                    description: media.description,
                })

            var updatedmedia = await this.fetchOneById(media.id)

            return updatedmedia

        }
        catch (err) {
            throw err
        }
    },
    delete: async (id) => {

        try{
            //on récupère le média
            var media = await this.fetchOneById(id)

            var result = await Knex('medias')
                .where('id', id)
                .del()
            
            return media

        }catch(err){
            throw err
        }
    },
    fetchMediasBySerieId: async (serieId) => {

        try{
            var results = await Knex('medias')
                .where('serie_id', serieId)
                .select(
                    'id',
                    'serie_id',
                    'title',
                    'description',
                    'mediatype',
                    'file',
                    'created',
                    'updated'
                )
            return results
        }
        catch(err){
            throw err
        }
    },
}

export default mediaDao