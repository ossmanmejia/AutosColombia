//Importo librería timeago 
const {format} = require('timeago.js');



//Creo una función que puede ser accedida por la vista
const helpers = {};

//Creo un método del objeto helpers
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

//Exporto el objeto helpers
module.exports = helpers;