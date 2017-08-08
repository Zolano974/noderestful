'use strict';
const Hapi = require('hapi');	//REST API framework
const Joi = require('joi'); 	//inputs validation
const Bcrypt = require('bcrypt'); 	// encryption
const HapiAuthJwt = require('hapi-auth-jwt');

import routes from './routes';

// Create a server with a host and port
const server = new Hapi.Server();


server.connection({
    host: 'localhost',
    port: 8000
});

// SETUP AUTHENTICATION
server.register(HapiAuthJwt, (err) => {

    //on définit la stratégie d'authent
    server.auth.strategy('token', 'jwt', {
        key: privateKey,
        verifyOptions: {
            algorithms: ['HS256'],
        }
    });

    //on ajoute les routes issues de routes.js
    routes.forEach((route) => {
        console.log( `attaching ${ route.path }` );
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
