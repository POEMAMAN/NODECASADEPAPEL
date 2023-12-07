const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const characters = await Character.find();
        return res.status(200).json(characters)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.get('/name/:name', [isAuthenticated], async (req, res, next) => {
    try {
        const name = req.params.name;
        const characters = await Character.find({name: name});
        return res.status(200).json(characters[0].name)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.get('/:id', [isAuthenticated], async (req, res, next) => {
    const id = req.params.id;
    try {
        const character = await Character.findById(id);
        if (character) {
            return res.status(200).json(character);
        } else {
            let error = new Error('Personaje no encontrado');
            error.status = 404;
            throw error;
        }
    }
    catch (err) {
        console.log(err);
        //return res.status(500).send(err.message);
        next(err)
    }
})

router.get('/age/:age', [isAuthenticated], async (req, res, next) => {
    const age = req.params.age; //const {age} = req.params;
    try {
        const characterByAge = await Character.find({age: {$eq: age}});
        if(!characterByAge.length) {
            return res.status(404).send(`No se han encontrado personajes con más de ${age} años.`)
        } else {
            return res.status(200).json(characterByAge);
        }
    }
    catch (err) {
        next(err)
    }
});

router.post('/',[isAuthenticated], upload.single('picture'), async (req, res, next) => {
    try {
        const characterPicture = req.file ? req.file.filename : null; //req.file.path
        console.log(req.body)
        const newCharacter = new Character({
            name: req.body.name,
            alias: req.body.alias,
            age: req.body.age,
            picture: characterPicture
        });
        const createdCharacter = await newCharacter.save();

        console.log(newCharacter);
        res.status(201).json(createdCharacter)
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedCharacter = await Character.findByIdAndDelete(id);
        console.log(deletedCharacter);
        if (deletedCharacter) {
            res.status(200).json(deletedCharacter);
        } else {
            let error = new Error('Personaje no encontrado');
            error.status = 404;
            throw error;
        }
    }
    catch (err) {
        next(err)
    }
})

router.put('/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const characterModify = new Character(req.body);
        characterModify._id = id;
        const characterUpdate = await Character.findByIdAndUpdate(id, characterModify);
        if (!characterUpdate) {
            let error = new Error('Personaje no encontrado');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(characterUpdate);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router;