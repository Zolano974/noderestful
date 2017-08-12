import Knex from '../knex';                  //QueryBuilder
import fileHelper from '../filehelper'

const videoDao = {
    getAllVideos: function (request, reply) {

        //on gère le cas OPTIONS
        if(request.method === 'options'){
            reply()
                .header('Access-Control-Allow-Origin', '*')
                .header('Access-Control-Allow-Headers', 'Authorization')
            return
        }

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
                    videos: results,
                    count: results.length,
                });
            }).catch((err) => {
                reply('server-side error');
            });
    },
    getVideoById: function (request, reply) {
        const id = request.params.id;

        //on gère le cas OPTIONS
        if(request.method === 'options'){
            reply().header('Access-Control-Allow-Origin', '*').header('Access-Control-Allow-Headers', 'Authorization')
            return
        }

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

        //on gère le cas OPTIONS
        if(request.method === 'options'){
            reply().header('Access-Control-Allow-Origin', '*').header('Access-Control-Allow-Headers', 'Authorization')
            return
        }

        if(!video.file){

            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.upload(video.file, 'videos')

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

        //on gère le cas OPTIONS
        if(request.method === 'options'){
            reply().header('Access-Control-Allow-Origin', '*').header('Access-Control-Allow-Headers', 'Authorization')
            return
        }

        //ajout d'un utilisateur
        Knex('videos')
            .where('id', id)
            .update({
                title: video.title,
                description: video.description,
            }).then((results) => {
                reply({
                    id: id,
                    title: video.title,
                    description: video.description
                })
            }).catch((err) => {
                reply(err)

            })
    },
    deleteVideo: function (request, reply) {
        const id = request.params.id;

        //on gère le cas OPTIONS
        if(request.method === 'options'){
            reply().header('Access-Control-Allow-Origin', '*').header('Access-Control-Allow-Headers', 'Authorization')
            return
        }

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
                reply("zob")
            });
    },
    //CUSTOM
    getAllVideosBySerieId: async function(serieId){

        return await Knex('videos')
                    .where('link_series_videos.serie_id', serieId)
                    .select(
                        'videos.id',
                        'title',
                        'desription',
                        'file',
                        'created',
                    )
                    .leftJoin(
                        'link_series_videos',
                        'videos.id',
                        'link_series_videos.video_id'
                    )
    },
}

export default videoDao
