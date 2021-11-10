define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var payloadFechas = {};
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

        console.log('qué ondis22');
        console.log(data.arguments.execute.inArguments);

        console.log('qué ondis4');
        console.log(data.arguments.execute.outArguments);

        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        var tamJson = (JSON.stringify(inArguments[0].Mensaje)).length;
        var JsonFeriados = (JSON.stringify(inArguments[0].Feriados));
        //var TamJsonFeriados = (JSON.stringify(inArguments[0].Feriados)).length;
        var contenidoMensaje = (JSON.stringify(inArguments[0].Mensaje)).substring(1, tamJson - 1);

        /*
        var Datos = DataExtension.Init("Datos");
        var complexfilter = {
            LeftOperand: {
                Property: "Nombre",
                SimpleOperator: "equals",
                Value: Nombre
            },
            LogicalOperator: "AND",
            RightOperand: {
                Property: "Monto",
                SimpleOperator: "greater than",
                Value: Monto
            }
        };

        var moredata = Datos.Rows.Retrieve(complexfilter);
        */

        contenidoMensaje = contenidoMensaje.replaceAll('\n', '\n');
        contenidoMensaje = contenidoMensaje.replaceAll('\\', '');

        document.getElementById('content').value = contenidoMensaje;
        document.getElementById('content2').value = JsonFeriados;
        /*
        var identificador = ',';

        if (JsonFeriados != null && JsonFeriados.length > 0) {
            var partsArray = JsonFeriados.split(identificador);
            var cont = 0;
            var aux2 = partsArray.length;

            while (aux2 > 0) {
                partsArray[cont] = partsArray[cont].trim();
                cont++;
                aux2--;
            }

            console.log('Acá se muestran las fechas:');
            
            console.log(partsArray[0]);
            console.log(partsArray[1]);
            console.log(partsArray[2]);
            
        }
        */


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


        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens
        }];


        payload['metaData'].isConfigured = true;
        payload['arguments'].execute.inArguments[0].Mensaje = document.getElementById('content').value;
        payload['arguments'].execute.inArguments[0].Nombre = "{{Contact.Attribute.30092021_Journey_Mora.Nombre}}"
        payload['arguments'].execute.inArguments[0].Monto = "{{Contact.Attribute.30092021_Journey_Mora.Monto}}"
        payload['arguments'].execute.inArguments[0].nroWPP = "{{Contact.Attribute.30092021_Journey_Mora.nroWPP}}"
        payload['arguments'].execute.inArguments[0].linkWPP = "{{Contact.Attribute.30092021_Journey_Mora.linkWPP}}"
        payload['arguments'].execute.inArguments[0].Feriados = document.getElementById('content2').value;

        console.log('JSON Despues de guardar las variables a enviar');
        console.log(payload.arguments.execute.inArguments);
        connection.trigger('updateActivity', payload);

    }


});
