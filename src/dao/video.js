import Knex from '../knex';                  //QueryBuilder
import fileUpload from '../filehelper'

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

        if(!video.file){

            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileUpload.upload(video.file, 'videos')

        //ajout d'un utilisateur
        Knex('videos')
            .returning('id')
            .insert(
                {
                    title: video.title,
                    description: video.description,
                    file: path,
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
            .select('file')
            .then((results) => {

                //gestion de l'absence de données
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no file found for video',
                    })
                    return
                }

                var filepath = results[0].file

                //on supprime le fichier
                fileHelper.remove(filepath)

                //on supprime en base
                Knex('videos')
                    .where('id', id)
                    .del()
                    .then((results) => {
                        reply(results)
                    })
                    .catch((err) => {
                        reply('server-side error I')
                    });
            })
            .catch((err) => {
                reply(err)
            });
    },
}

export default videoDao
