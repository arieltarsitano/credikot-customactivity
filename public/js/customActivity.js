define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');

    }

    function onRequestedDataSources(dataSources) {
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction(interaction) {
        console.log('*** requestedInteraction ***');
        console.log(interaction);
    }

    function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log('qué ondis');
        console.log(data.arguments.execute);

        console.log('qué ondis2');
        console.log(data.arguments.execute.inArguments);

        console.log('qué ondis3');
        console.log(data.arguments.execute.inArguments.content);

        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        console.log('payload acá');
        console.log(payload);
        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('payload la venganza');
        console.log(inArguments);

        var tamJson = (JSON.stringify(inArguments[0].Mensaje)).length;
        var contenidoMensaje = (JSON.stringify(inArguments[0].Mensaje)).substring(1, tamJson - 1);
        contenidoMensaje = contenidoMensaje.replaceAll('\n', '\\n');
        contenidoMensaje = contenidoMensaje.replaceAll('\\', '');

        document.getElementById('content').value = contenidoMensaje;


        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {

        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

        console.log('se mete a save');
        console.log(payload.arguments.execute.inArguments);

        /*
        payload['arguments'].execute.inArguments.push({
            "tokens": 'hola'
        });
        */

        payload['metaData'].isConfigured = true;
        //payload['arguments'].execute.inArguments[0].Mensaje = JSON.parse(document.getElementById('content'));
        payload['arguments'].execute.inArguments[0].Mensaje = document.getElementById('content').value;

        console.log('se mete a save2222222');
        console.log(payload.arguments.execute.inArguments);
        connection.trigger('updateActivity', payload);
    }


});
