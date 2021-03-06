import Knex from '../lib/knex';                  //QueryBuilder
import mediaDao from '../dao/media'

const serieDao = {

    fetchAll: async () => {

        try{
            var series = await  Knex('series')
                                .select(
                                    'id',
                                    'name',
                                    'description',
                                    'picture',
                                    'created',
                                    'updated'
                                )
            return series
        }catch(err){
            throw err
        }
    },
    fetchOneById: async (id) => {
        try{
            var series = await  Knex('series')
                                .where('id', id)
                                .select(
                                    'id',
                                    'name',
                                    'description',
                                    'picture',
                                    'created',
                                    'updated'
                                )
            try{
                var medias = await mediaDao.fetchMediasBySerieId(id)

                var serieWithMedias = (!series || series.length === 0) ? null : {
                    ...series[0],
                    medias: medias
                }

                return serieWithMedias
            }
            catch(err2){
                throw err2
            }
        }catch(err1){
            throw err1
        }

    },
    insert: async (serie, path) => {

        try{
            var res =     await Knex('series')
                                .returning('id')
                                .insert({
                                        name : serie.name,
                                        description : serie.description,
                                        picture: path,
                                })

            console.log(res)
            console.log(res[0])

            try{
                var insertedSerie = await serieDao.fetchOneById(res[0])

                console.log(insertedSerie)

                return insertedSerie

            }catch(err2){
                throw err2
            }


        }catch(err){
            console.log(err)
            throw err
        }

    },
    update: async (serie, id, path) => {

        try{
            //on update la série
            var res = await  Knex('series')
                            .where('id', id)
                            .update({
                                name : serie.name,
                                description : serie.description,
                                picture: path,
                            })

            try{

                //on renvoie l'objet complet
                var updatedSerie = await serieDao.fetchOneById(id)

                return updatedSerie

            }catch(err2){
                throw err2
            }
        }
        catch(err){
            throw err
        }

    },
    delete: async (id) => {
        try{
            
            var serie = await serieDao.fetchOneById(id)

            //on supprime la série
            var res = await Knex('series')
                .where('id', id)
                .del()

            return serie

        }catch(err){
            throw err
        }
    }
}

export default serieDao
