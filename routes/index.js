'use strict';

var textoMora1 = "Tipo de mora 1";
var textoMora2 = "Tipo de mora 2";
var textoMora3 = "Tipo de mora 3";
var textoMora4 = "Tipo de mora 4";
var textoMora5 = "Tipo de mora 5";

//Deps
var activity = require('./activity');

/*
 * GET home page.
 */
exports.index = function (req, res) {
    if (!req.session.token) {
        res.render('index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via Salesforce Marketing Cloud',
        });
    } else {
        res.render('index', {
            title: 'Journey Builder Activity',
            results: activity.logExecuteData,
        });
    }
};

exports.login = function (req, res) {
    console.log('req.body: ', req.body);
    res.redirect('/');
};

exports.logout = function (req, res) {
    req.session.token = '';
};