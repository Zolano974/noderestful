'use strict';

const Hapi = require('hapi');	                //REST API framework

const HapiAuthJwt = require('hapi-auth-jwt');   //auth JWT

const jwt = require('jsonwebtoken');            //JWT

import routes from './src/routes';              //Routes

import private_key from './src/privatekey';     //privatekey

// Create a server with a host and port
const server = new Hapi.Server();

//set up server connection
server.connection({
    host: 'localhost',
    port: 8000
});

// SETUP SERVER
server.register(HapiAuthJwt, (err) => {

    //on définit la stratégie d'authent
    server.auth.strategy('token', 'jwt', {
        key: private_key,
        verifyOptions: {
            algorithms: ['HS256'],
        }
    });

    //on ajoute les routes issues de routes.js
    routes.forEach((route) => {
        console.log( `attaching ${ route.method } route ${ route.path }` );
        server.route( route );
    });

});

//Launch
server.start((err) => {
    if (err) {
        console.error('error handled');
        console.error(err);
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
