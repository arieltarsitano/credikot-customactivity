'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');


exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    //res.send(200, 'Save');
    res.status(200).send('Save');

};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {




    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];

            // Acá llamamos al web service
            var request = require('request');
            const util = require("util");

            console.log('acá decoded');
            console.log(decoded);
            console.log('acá decodedArgs');
            console.log(decodedArgs);

            const feriadoVector = ["20/11/2021", "22/11/2021", "8/12/2021", "25/12/2021"];

            const numtel = decoded.keyValue;
            const texto = decoded.inArguments[0].Mensaje;
            const feriados = decoded.inArguments[0].Feriados;
            console.log('acá feriados');
            console.log(feriados);
            const textoEntero = texto;

            if (feriados != null && feriados.length > 0) {

                for (feriados = 0; feriados < 4; feriados++) {

                    if (feriadoVector[0] == feriados || feriadoVector[1] == feriados || feriadoVector[3] == feriados || feriadoVector[4] == feriados) {
                        const urlSmsMasivo = `http://servicio.smsmasivos.com.ar/enviar_sms.asp?api=1&usuario=CREDIKOT&clave=CREDIKOT443&tos=${numtel}&texto=${textoEntero}`

                        var options = {
                            'method': 'POST',
                            'url': urlSmsMasivo,
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        };

                        request(options, function (error, response) {
                            if (error) throw new Error(error);
                            console.log(response.body);
                        });

                        /////

                        logData(req);
                        res.status(200).send('Execute');
                    }

                    else {
                        console.error('inArguments invalid.');
                        return res.status(400).end();
                    }

                } //for
            }
        }

    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Validate');
};