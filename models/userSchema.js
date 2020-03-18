var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    gender: String,
    phone: String,
    todos: [{
        type: mongoose.Schema.Types.ObjectId, ref:'todo'
    }],
    create_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('user', userSchema);