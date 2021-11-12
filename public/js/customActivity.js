const { validate } = require("../../routes/activity");

define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var retornaValorFecha = false;

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
        //var TamJsonFeriados = (JSON.stringify(inArguments[0].Feriados)).length;
        var JsonFeriados = inArguments[0].Feriados;//   (JSON.stringify(inArguments[0].Feriados)).substring(1, TamJsonFeriados - 1);
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


    function sinBlancos(JsonFeriados) {
        var identificador = ',';
        var separador = '/'


        if (JsonFeriados != null && JsonFeriados.length > 0) {
            var partsArray = JsonFeriados.split(identificador);
            var cont = 0;
            var aux2 = partsArray.length;

            while (aux2 > 0) {
                partsArray[cont] = partsArray[cont].trim();
                var fecha = partsArray[cont].split(separador);

                if (fecha[0].length != 2) {
                    fecha[0] = '0' + fecha[0];
                }
                if (fecha[1].length != 2) {
                    fecha[1] = '0' + fecha[1];
                }

                partsArray[cont] = fecha[0] + '/' + fecha[1] + '/' + fecha[2];
                cont++;
                aux2--;
            }

        }

        return partsArray;
    }

    /*
    function comillas(JsonFeriados) {

        if (JsonFeriados != null && JsonFeriados.length > 0) {
            var partsArray = [];
            var cont = 0;
            var tam = JsonFeriados.length;

            while (tam > 0) {
                partsArray[cont] = JsonFeriados[cont].substring(1, JsonFeriados[cont].length - 1);
                cont++;
                tam--;
            }

        }

        return partsArray;
    }
    */

    function isValidDate(dateString) {
        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };


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




        payload['arguments'].execute.inArguments[0].Feriados = sinBlancos(document.getElementById('content2').value);

        console.log('JSON Despues de guardar las variables a enviar');
        console.log(payload.arguments.execute.inArguments);

        //var feriadosFor = payload['arguments'].execute.inArguments[0].Feriados;
        /*


        for (var i = 0; i < maxIter; i++) {
            retornaValorFecha = isValidDate(payload['arguments'].execute.inArguments[i].Feriados);

            if (retornaValorFecha == false) {
                break;
            }
        }
        */

        var maxIter = payload['arguments'].execute.inArguments[0].Feriados.length;

        retornaValorFecha = isValidDate(element);
        var i = 0;

        while (retornaValorFecha == true && maxIter > 0) {

            maxIter--;
            retornaValorFecha = isValidDate(payload['arguments'].execute.inArguments[0].Feriados[i]);
            i++;
        }

        if (retornaValorFecha == true) {
            connection.trigger('updateActivity', payload);
        }
    }

});
