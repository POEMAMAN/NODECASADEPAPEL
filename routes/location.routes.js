const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const {isAuthenticated} = require('../middleware/auth.middleware');

router.get('/', [isAuthenticated], async (req, res, next) => {
    try {
        const locations = await Location.find().populate('characters');
        return res.status(200).json(locations);
    }
    catch (err) {
        next(err)
    }
})

router.post('/create', [isAuthenticated], async (req, res, next) => {
    try {
        const newLocation = new Location({
            name: req.body.name,
            loot: req. body.loot,
            characters: []
        })
        const createdLocation = await newLocation.save();
        return res.status(201).json(createdLocation);
    }
    catch (err) {
        next(err)
    }
})

router.put('/add-character', [isAuthenticated], async (req, res, next) => {
    try {
        const locationId = req.body.locationId;
        const characterId = req.body.characterId;
        const updatedLocation = await Location.findByIdAndUpdate(locationId, {
            $push: { characters: characterId}
        })
        return res.status(200).json("Se ha enviado correctamente")
    }
    catch (err) {
        next(err)
    }
})

module.exports = router;