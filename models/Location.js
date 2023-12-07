const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema ({
    name: {type: String, required: true},
    loot: {type: String, required: true},
    characters: [{type: mongoose.Types.ObjectId, ref: 'Character'}]
},
{
    timestamps: true
})

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;