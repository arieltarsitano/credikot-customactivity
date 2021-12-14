//const { validate } = require("../../routes/activity.js");
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

        //var tipoJourneyIni = JSON.stringify(payload['arguments'].execute.inArguments[0].Boton);
        var tipoJourneyIni = inArguments[0].Boton;

        console.log('Aca valor tipoJourneyIni');
        console.log(tipoJourneyIni);

        if (tipoJourneyIni == 'Venta') {
            console.log('Segunda vuelta, se mete tipoJoureyIni parte IF VENTA')
            document.getElementById('Journey1').checked = false;
            console.log(document.getElementById('Journey1').checked);
            document.getElementById('Journey2').checked = true;
            console.log(document.getElementById('Journey2').checked);

        } else if (tipoJourneyIni == 'Mora') {
            console.log('Segunda vuelta, se mete tipoJoureyIni ELSE MORA')
            document.getElementById('Journey1').checked = true;
            console.log(document.getElementById('Journey1').checked);
            document.getElementById('Journey2').checked = false;
            console.log(document.getElementById('Journey2').checked);
        }

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
        var partsArray = [];

        if (JsonFeriados != null && JsonFeriados.length > 0) {
            partsArray = JsonFeriados.split(identificador);
            partsArray = partsArray.filter(x => x != null && x != '');
            //console.log('partsarray acá todo lindo');
            console.log(partsArray);
            var cont = 0;
            var aux2 = partsArray.length;

            while (aux2 > 0) {

                partsArray[cont] = partsArray[cont].trim();
                var fecha = partsArray[cont].split(separador);

                if (fecha != null && fecha != '') {

                    if (fecha[0].length != 2) {
                        fecha[0] = '0' + fecha[0];
                    }
                    if (fecha[1].length != 2) {
                        fecha[1] = '0' + fecha[1];
                    }

                    partsArray[cont] = fecha[0] + '/' + fecha[1] + '/' + fecha[2];
                }

                console.log('fecha acá');
                console.log(fecha);

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


        // Parse the date parts to integers<
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

        const datoFecha = new Date(year, month, day);
        var today = new Date();
        //var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();


        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1] && datoFecha >= today;
    };


    function save() {

        const d = new Date();
        d.setDate(24);
        d.setMonth(11);


        var year = d.getFullYear(),
            month = (d.getMonth() + 1).toString(),
            formatedMonth = (month.length === 1) ? ("0" + month) : month,
            day = d.getDate().toString(),
            formatedDay = (day.length === 1) ? ("0" + day) : day

        var fechaDefecto = formatedDay + "/" + formatedMonth + "/" + year;


        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

        console.log('se mete a save');
        console.log(payload.arguments.execute.inArguments);


        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens
        }];

        var boton1 = document.getElementById('Journey1').checked;
        var boton2 = document.getElementById('Journey2').checked;

        var tipoJourney = JSON.stringify(payload['arguments'].execute.inArguments[0].Boton);
        //var tipoJourney = payload['arguments'].execute.inArguments[0].Boton;
        console.log('Aca tipoJourney del save');
        console.log(tipoJourney);

        payload['metaData'].isConfigured = true;
        payload['arguments'].execute.inArguments[0].Feriados = sinBlancos(document.getElementById('content2').value);
        payload['arguments'].execute.inArguments[0].Mensaje = document.getElementById('content').value;
        console.log('Boton 1:');
        console.log(boton1);

        console.log('Boton 2:');
        console.log(boton2);


        if ((boton1 == true && boton2 == false) || tipoJourney == 'Mora') {
            payload['metaData'].isConfigured = true;
            payload['arguments'].execute.inArguments[0].Mensaje = document.getElementById('content').value;
            payload['arguments'].execute.inArguments[0].Nombre = "{{Contact.Attribute.30092021_Journey_Mora.Nombre}}"
            payload['arguments'].execute.inArguments[0].Monto = "{{Contact.Attribute.30092021_Journey_Mora.Monto}}"
            payload['arguments'].execute.inArguments[0].nroWPP = "{{Contact.Attribute.30092021_Journey_Mora.nroWPP}}"
            payload['arguments'].execute.inArguments[0].linkWPP = "{{Contact.Attribute.30092021_Journey_Mora.linkWPP}}"
            payload['arguments'].execute.inArguments[0].Telefono = "{{Contact.Attribute.30092021_Journey_Mora.Telefono}}"
            payload['arguments'].execute.inArguments[0].Feriados = sinBlancos(document.getElementById('content2').value);
            payload['arguments'].execute.inArguments[0].Boton = "Mora";
            console.log('Entró a guardar j1');

        } else if ((boton2 == true && boton1 == false) || tipoJourney == 'Venta') {
            payload['metaData'].isConfigured = true;
            payload['arguments'].execute.inArguments[0].Mensaje = document.getElementById('content').value;
            payload['arguments'].execute.inArguments[0].Nombre = "{{Contact.Attribute.CredikotJourney2.Nombre}}"
            payload['arguments'].execute.inArguments[0].Monto = "{{Contact.Attribute.CredikotJourney2.Monto}}"
            payload['arguments'].execute.inArguments[0].nroWPP = "{{Contact.Attribute.CredikotJourney2.nroWPP}}"
            payload['arguments'].execute.inArguments[0].linkWPP = "{{Contact.Attribute.CredikotJourney2.linkWPP}}"
            payload['arguments'].execute.inArguments[0].Telefono = "{{Contact.Attribute.CredikotJourney2.Telefono}}"
            payload['arguments'].execute.inArguments[0].Feriados = sinBlancos(document.getElementById('content2').value);
            payload['arguments'].execute.inArguments[0].Boton = "Venta";
            console.log('Entró a guardar j2');
        }



        //var maxIter = 0;
        var maxIter = payload['arguments'].execute.inArguments[0].Feriados.length;

        if (maxIter == 0) {
            payload['arguments'].execute.inArguments[0].Feriados[0] = fechaDefecto;

        }
        else {
            var i = 0;
            //retornaValorFecha = isValidDate(payload['arguments'].execute.inArguments[0].Feriados[i]);
            console.log('es retornavalorfecha:')
            console.log(retornaValorFecha);

            var vectorAux = [];

            while (maxIter > 0) {

                maxIter--;
                retornaValorFecha = isValidDate(payload['arguments'].execute.inArguments[0].Feriados[i]);

                if (retornaValorFecha == true) {
                    vectorAux.push(payload['arguments'].execute.inArguments[0].Feriados[i]);
                }
                i++;
            }

            payload['arguments'].execute.inArguments[0].Feriados = vectorAux;
            console.log('vector Aux con feriados bandera:');
            console.log(payload['arguments'].execute.inArguments[0].Feriados);
        }



        console.log('JSON Despues de guardar las variables a enviar');
        console.log(payload.arguments.execute.inArguments);
        console.log(payload.arguments.execute.inArguments[0]);
        connection.trigger('updateActivity', payload);
        console.log('todo ok');

    }


});
