import Knex from '../knex'               //QueryBuilder
import fileHelper from '../filehelper'

const photoDao = {
    getAllPhotos: function (request, reply) {

        Knex('photos')
            .select('id','title','description', 'file', 'created')
            .then((results) => {
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no photos found',
                    });
                    return;
                }
                //response
                reply({
                    data: results,
                    count: results.length,
                });
            }).catch((err) => {
                reply('server-side error');
            })
    },
    getPhotoById: function (request, reply) {
        const id = request.params.id;

        Knex('photos')
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
                        errMessage: 'no photos found by id ' + id,
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
    createPhoto: function (request, reply) {

        const photo = request.payload;

        if(!photo.file){

            reply('nofile')
            return
        }

        //on upload le fichier
        var path = fileHelper.upload(photo.file)

        //on insère la photo
        Knex('photos')
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
            ).then((results) => {
                reply(results)
            }).catch((err) => {
                reply(err)
                // reply('server-side error')
            })

    },
    updatePhoto: function (request, reply) {

        const id = request.params.id;
        const photo = request.payload;

        //ajout d'un utilisateur
        Knex('photos')
            .where('id', id)
            .update({
                title: photo.title,
                description: photo.description,
            }).then((results) => {
            reply(true)
        }).catch((err) => {
            reply(err)
            // reply('server-side error')
        })
    },
    deletePhoto: async function (request, reply) {
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

                    // if(results.length > 0){
                    //     reply('deletion complete')
                    //     return;
                    // }
                    // reply(false);
                    // return;
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
}

export default photoDao
