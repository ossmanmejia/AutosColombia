//Este archivo helpers es para reutilizar métodos
const helpers = {};

//Se importa bcrypt para encriptar contraseñas
const bcrypt = require('bcryptjs');

//Método para encriptar contraseñas
helpers.encryptPassword = async (password) => {
    //El modulo bycrypt es una libreria que permite encriptar contraseñas
    //Se genera un patron de encriptación
    const salt = await bcrypt.genSalt(10);
    //Se encripta la contraseña
    const hash = await bcrypt.hash(password, salt);
    //Se retorna el hash de la contraseña
    return hash;
};

//Método para comparar contraseñas
helpers.matchPassword = async (password, savedPasword) => {
    try {
    //Se verifica si la contraseña ingresada es igual a la guardada en la base de datos
        return await bcrypt.compare(password, savedPasword);
    } catch (e) {
        console.log(e);
    }
};

//Se exporta helpers
module.exports = helpers;