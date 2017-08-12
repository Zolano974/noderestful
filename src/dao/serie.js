import Knex from '../knex';                  //QueryBuilder

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

        //ajout d'un utilisateur
        Knex('series')
            .returning('id')
            .insert(
                {
                    name : serie.name,
                    description : serie.description,
                    picture: serie.picture,
                    mediatype : serie.mediatype
                }
            ).then((results) => {
            reply(results.id)
        }).catch((err) => {
            reply(err)
            // reply('server-side error')
        })
    },
    updateSerie: function (request, reply) {

        const id = request.params.id;
        const serie = request.payload;

        //ajout d'un utilisateur
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
    },
    deleteSerie: function (request, reply) {
        const id = request.params.id;
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
    },
}

export default serieDao
