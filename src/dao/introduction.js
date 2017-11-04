import Knex from '../lib/knex'               //QueryBuilder

const introDao = {

    get: async () => {
        try{
            var intro = await Knex('introduction')
                .select(
                    'title',
                    'body',
                    'picture',
                )

            return intro
        }catch(err){
            throw err
        }
    },
    set: async (intro, path) => {
        try{

            var insertId = await Knex('introduction')
                .returning(
                    'id',
                )
                .replace(
                    {
                        id: 1,
                        title: intro.title,
                        body: intro.body,
                        picture: path
                    }
                )

            return intro

        }catch(err){
            throw err
        }

    }
}

export default introDao