const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const characterSchema = new Schema(
    {
        name: {type: String, required: true},
        age: {type: Number, required: true},
        alias: {type: String, required: true},
        picture: {type: String}
    },
    {
        timestamps: true
    }
);

const Character= mongoose.model('Character', characterSchema);
module.exports = Character;