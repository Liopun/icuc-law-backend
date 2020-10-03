const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const clientsSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    tel: {
        type: String
    },
    lawyer: {
        type: String,
        required: true
    },
    addedby: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    notes: [
        {
            description: {
                type: String,
                required: true
            },
            addedby: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Clients = mongoose.model('clients', clientsSchema);