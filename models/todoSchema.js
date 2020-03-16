var mongoose = require('mongoose');
var todoSchema = new mongoose.Schema({
    title: String,
    desc: String,
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    file: {
        type: String
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('todo', todoSchema);