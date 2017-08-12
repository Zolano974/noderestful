import Knex from '../knex';                  //QueryBuilder
import fileHelper from '../filehelper'

const serieDao = {
    getAllSeries: function (request, reply) {

        Knex('series')
            .select(
                'id',
                'name',
                'description',
                'picture',
                'mediatype',
                'created',
                'updated'
            )
            .then((results) => {
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no series found',
                    });
                }
                //response
                reply({
                    data: results,
                    count: results.length,
                });
            }).catch((err) => {
            reply('server-side error');
        });
    },
    getSerieById:function (request, reply) {
        const id = request.params.id;

        Knex('series')
            .where('id', id)
            .select(
                'id',
                'name',
                'description',
                'picture',
                'mediatype',
                'created',
                'updated'
            )
            .then((results) => {
                //gestion de l'absence de données
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no series found by id ' + id,
                    });
                }

                //response
                reply({
                    data: results,
                });
            })
            .catch((err) => {
                reply( 'server-side error' );
            });

    },
    createSerie: function (request, reply) {

        const serie = request.payload;

        if(!serie.file){

            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.upload(serie.file, 'series')

        //ajout d'un utilisateur
        Knex('series')
            .returning('id')
            .insert(
                {
                    name : serie.name,
                    description : serie.description,
                    picture: path,
                    mediatype : serie.mediatype
                }
            ).then((results) => {
                reply(results)
            }).catch((err) => {
                reply(err)
                // reply('server-side error')
            })
    },
    updateSerie: function (request, reply) {

        const id = request.params.id;
        const serie = request.payload;

        Knex('series')
            .where('id', id)
            .select('picture')
            .then((results) => {

                //gestion de l'absence de données
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'serie not found',
                    })
                    return
                }

                var filepath = results[0].picture

                //on supprime l'ancien fichier
                fileHelper.remove(filepath)

                //on upload le nouveau
                fileHelper.upload(serie.picture, 'series')

                //on update la série
                Knex('series')
                    .where('id', id)
                    .update({
                        name : serie.name,
                        description : serie.description,
                        picture: serie.picture,
                        mediatype : serie.mediatype
                    }).then((results) => {
                    reply(true)
                }).catch((err) => {
                    reply(err)
                    // reply('server-side error')
                })
            })
            .catch((err) => {
                reply(err)
            });


    },
    deleteSerie: function (request, reply) {
        const id = request.params.id;
        Knex('series')
            .where('id', id)
            .select('picture')
            .then((results) => {

                //gestion de l'absence de données
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'serie not found',
                    })
                    return
                }

                var filepath = results[0].picture

                //on supprime le fichier
                fileHelper.remove(filepath)

                //on supprime la série
                Knex('series')
                    .where('id', id)
                    .del()
                    .then((results) => {
                        if(results.length > 0){
                            reply(true)
                            return;
                        }
                        reply(false);
                        return;
                    })
                    .catch((err) => {
                        reply('server-side error')
                    });
            })
            .catch((err) => {
                reply(err)
            });


    },
}

export default serieDao
