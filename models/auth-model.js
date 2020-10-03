const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const authSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = Auth = mongoose.model('users', authSchema);