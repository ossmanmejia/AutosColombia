//Importo librería timeago 
const {format, register} = require('timeago.js');

register('es_ES', (number, index, total_sec) => [
    ['justo ahora', 'ahora mismo'],
    ['%s segundos', 'en %s segundos'],
    ['1 minuto', 'en 1 minuto'],
    ['%s minutos', 'en %s minutos'],
    ['1 hora', 'en 1 hora'],
    ['%s horas', 'in %s horas'],
    ['1 dia', 'en 1 dia'],
    ['%s dias', 'en %s dias'],
    ['1 semana', 'en 1 semana'],
    ['%s semanas', 'en %s semanas'],
    ['1 mes', 'en 1 mes'],
    ['%s meses', 'en %s meses'],
    ['1 año', 'en 1 año'],
    ['%s años', 'en %s años']
][index]);

//Creo una función que puede ser accedida por la vista
const helpers = {};

//Creo un método del objeto helpers
helpers.timeago = (timestamp) => {
    return format(timestamp, 'es_ES');
};

//Exporto el objeto helpers
module.exports = helpers;