export default require('knex')({

    client: 'mysql',
    connection: {
        host: '127.0.0.1',

        user: 'root',
        password: '',

        database: 'apiV2',
        charset: 'utf8',
    }
    // connection: {
    //     host: '0.0.0.0',
    //
    //     user: 'root',
    //     password: '123',
    //
    //     database: 'restful',
    //     charset: 'utf8',
    // }

});