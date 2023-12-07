const mongoose = require('mongoose');
require('dotenv').config();
const Character = require('../models/Character.js');


const characters = [
    {
        name: 'Úrsula Corberó',
        age: 32,
        alias: 'Tokio'
    },
    {
        name: 'Pedro Alonso',
        age: 50,
        alias: 'Berlín'
    },
    {
        name: 'Álvaro Morte',
        age: 46,
        alias: 'El Profesor'
    },
    {
        name: 'Alba Flores',
        age: 34,
        alias: 'Nairobi'
    },
    {
        name: 'Jaime Lorente',
        age: 29,
        alias: 'Denver'
    },
    {
        name: 'Darko Peric',
        age: 44,
        alias: 'Helsinki'
    }
];

const characterDocuments = characters.map(character => new Character(character))

//1. Buscar si hay personajes creados, si los hay los borramos. 
//2. Insetrar personajes.
//3. Controlar errores.
//4. Desconexión

mongoose.connect(process.env.MONGODB_URL, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})
.then(async() => {
    console.log('Conectado a MongoDB Atlas');
    const allCharacters = await Character.find();
    if (allCharacters.length){
        console.log('Había personajes ya creados, vamos a borrarlos');
        await Character.collection.drop();
    }
    
})
.catch((err) => console.log('Error al borrar los personajes', err))

.then(async () => {
    await Character.insertMany(characterDocuments);
    console.log('Personajes creados correctamente');
})
/*
santiagomartinezrois@MacBook-Pro-de-Santiago Node JS % node seeds/character.seed.js
Conectado a MongoDB Atlas
Había personajes ya creados, vamos a borrarlos
Error al crear los datos: MongoBulkWriteError: No write concern mode named 'majority;' found in replica set configuration
Desconectado de forma exitosa
Daba este error por el punto y coma al final del majority
.then(async () => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const options = { writeConcern: { w: 'majority' } };
        await Character.insertMany(characterDocuments, options);

        await session.commitTransaction();
        session.endSession();

        console.log('Personajes creados correctamente');
    } catch (error) {
        console.log(`Error al crear los datos: ${error}`);
    }
})
*/
.catch((err) => console.log(`Error al crear los datos: ${err}`))
.finally( ()=> 
    mongoose
        .disconnect()
        .then(() => console.log('Desconectado de forma exitosa')) 
);