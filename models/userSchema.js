var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    userName: {
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