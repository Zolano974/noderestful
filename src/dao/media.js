import Knex from '../knex'               //QueryBuilder

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
            var insertId = await Knex('media')
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
            var id = insertId[0]

            var media = await mediaDao.fetchOneById(id)

            return media[0]
        }
        catch (err) {
            console.log(err)
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

            var updatedmedia = await mediaDao.fetchOneById(id)

            return updatedmedia

        }
        catch (err) {
            throw err
        }
    },
    delete: async (id) => {

        try{
            //on récupère le média
            var media = await mediaDao.fetchOneById(id)

            var result = await Knex('media')
                .where('id', id)
                .del()
            
            return media

        }catch(err){
            throw err
        }
    },
    fetchMediasBySerieId: async (serieId) => {

        try{
            var results = await Knex('media')
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
