const { Timestamp } = require('bson');
const mongoose = require('mongoose');
const cryptoSchema = new mongoose.Schema({

    symbol: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    marketCapUsd: {
        type: String
    },
    priceUsd: {
        type: String
    },

},
    { timestamps: true })
module.exports = mongoose.model('coin', cryptoSchema)