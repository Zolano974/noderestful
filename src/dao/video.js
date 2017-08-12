import Knex from '../knex';                  //QueryBuilder

const videoDao = {
    getAllVideos: function (request, reply) {

        Knex('videos')
            .select(
                'id',
                'title',
                'description',
                'file',
                'created'
            )
            .then((results) => {
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no videos found',
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
    getVideoById: function (request, reply) {
        const id = request.params.id;

        Knex('videos')
            .where('id', id)
            .select(
                'id',
                'title',
                'desription',
                'file',
                'created',
            )
            .then((results) => {
                //gestion de l'absence de données
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no videos found by id ' + id,
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
    createVideo: function (request, reply) {

        const video = request.payload;

        //ajout d'un utilisateur
        Knex('videos')
            .returning('id')
            .insert(
                {
                    title: video.title,
                    description: video.description,
                    file: video.file,
                }
            ).then((results) => {
            reply(results)
        }).catch((err) => {
            reply(err)
            // reply('server-side error')
        })
    },
    updateVideo: function (request, reply) {

        const id = request.params.id;
        const video = request.payload;

        //ajout d'un utilisateur
        Knex('videos')
            .where('id', id)
            .update({
                title: video.title,
                description: video.description,
            }).then((results) => {
            reply(true)
        }).catch((err) => {
            reply(err)
            // reply('server-side error')
        })
    },
    deleteVideo: function (request, reply) {
        const id = request.params.id;
        Knex('videos')
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

export default videoDao
