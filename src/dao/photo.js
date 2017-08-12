import Knex from '../knex'               //QueryBuilder
import fileUpload from '../uploadfile'

const photoDao = {
    getAllPhotos: function (request, reply) {

        console.log(request.auth.credentials.groups)

        Knex('photos')
            .select('id','title','description', 'file', 'created')
            .then((results) => {
                if (!results || results.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no photos found',
                    });
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
        var path = fileUpload.upload(photo.file)


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
    deletePhoto: function (request, reply) {
        const id = request.params.id;
        Knex('photos')
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

export default photoDao
