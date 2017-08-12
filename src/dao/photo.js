import Knex from '../knex'               //QueryBuilder
import fileHelper from '../filehelper'

const photoDao = {
    getAllPhotos: async (request, reply) => {

        try {
            var results = await Knex('photos').select(
                'id',
                'title',
                'description',
                'file',
                'created'
            )
            if (!results || results.length === 0) {
                reply({
                    error: true,
                    errMessage: 'no photos found',
                })
                return
            }

            reply({
                photos: results,
                count: results.length,
            })
        } catch (err) {
            reply('server-side error');
        }

    },
    getPhotoById: async function (request, reply) {
        const id = request.params.id;

        try {
            var results = await Knex('photos')
                .where('id', id)
                .select(
                    'id',
                    'title',
                    'desription',
                    'file',
                    'created',
                )

            //gestion de l'absence de données
            if (!results || results.length === 0) {
                reply({
                    error: true,
                    errMessage: 'no photos found by id ' + id,
                });
            }

            //response
            reply({
                data: results,
            });
        } catch (err) {
            reply('server-side error');
        }

    },
    createPhoto: async function (request, reply) {

        const photo = request.payload;

        if (!photo.file) {

            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.upload(photo.file, 'photos')

        try {
            var results = await Knex('photos')
                .returning(
                    'id',
                    'title',
                    'description',
                    'file',
                    'created',
                )
                .insert(
                    {
                        title: photo.title,
                        description: photo.description,
                        file: path,
                    }
                )
            reply(results)
        }
        catch (err) {
            reply(err)
        }

    },
    updatePhoto: async function (request, reply) {

        const id = request.params.id
        const photo = request.payload

        try {

            var results = await Knex('photos')
                .where('id', id)
                .update({
                    title: photo.title,
                    description: photo.description,
                })

            reply({
                id: id,
                title: photo.title,
                description: photo.description
            })
        }
        catch (err) {
            reply(err)
        }
    },
    deletePhoto: function (request, reply) {
        const id = request.params.id;

        Knex('photos')
            .where('id', id)
            .select('file')
            .then((results) => {

                //gestion de l'absence de données
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no file found for photo',
                    })
                    return
                }

                var filepath = results[0].file

                //on supprime le fichier
                fileHelper.remove(filepath)

                //on supprime en base
                Knex('photos')
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
                // reply( 'server-side error II' );
            });
    },
    //CUSTOM
    getAllPhotosBySerieId: async function (serieId) {

        try{
            return await Knex('photos')
                .where('link_series_photos.serie_id', serieId)
                .select(
                    'photos.id',
                    'title',
                    'description',
                    'file',
                    'created',
                )
                .leftJoin(
                    'link_series_photos',
                    'photos.id',
                    'link_series_photos.photo_id'
                )

        }
        catch(err){
            console.log('error server-side')
        }
    },
}

export default photoDao
