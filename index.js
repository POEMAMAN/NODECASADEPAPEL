require('./utils/db.js');

const express = require('express');
const router = express.Router();
const session = require('express-session');
const Character = require('./models/Character');
const PORT = 3000;
const server = express();
const characterRoutes = require('./routes/character.routes');
const locationRoutes = require('./routes/location.routes');
const userRoutes = require('./routes/user.routes');
const passport = require('passport');
const MongoStore = require('connect-mongo');
require('./authentication/passport');
const cors = require('cors');

server.use(cors())
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
    session({
      secret: 'upgradehub_node', // ¡Este secreto tendremos que cambiarlo en producción!
      resave: false, // Solo guardará la sesión si hay cambios en ella.
      saveUninitialized: false, // Lo usaremos como false debido a que gestionamos nuestra sesión con Passport
      cookie: {
        maxAge: 3600000 // Milisegundos de duración de nuestra cookie, en este caso será una hora.
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
      })
    })
  );
server.use(passport.initialize());
server.use(passport.session());
server.use('/characters', characterRoutes);
server.use('/location', locationRoutes);
server.use('/user', userRoutes);

server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Error inesperado');
})

server.listen(PORT, ()=>{
    console.log(`El servidor esta corriendo http://localhost:${PORT}`);
})

//npm i passport passport-local bcrypt express-session connect-mongo