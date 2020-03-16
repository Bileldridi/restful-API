let router = require('express').Router();
var User = require('./../models/userSchema');

router.get('/all', function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.send({
                status: "error",
                message: err,
            });
        }
        res.send({
            message: "Users retrieved successfully",
            data: users
        });
    });
});

router.post('/all', function (req, res) {
    User.create(req.body, function (err, post) {
        if (err)
            res.send(err);
        res.send({
            message: 'New user created!',
            data: post
        });
    });
});
router.get('/all/:user_id', function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);
        res.send({
            message: 'User details loading..',
            data: user
        });
    })
});

router.patch('/all/:user_id', function (req, res) {
    User.findByIdAndUpdate(req.params.user_id, req.body, function (err, post) {
            if (err)
                res.send(err);
                res.send({
                    message: 'User Info updated',
                    data: post
                });
            });
        });
    
    router.delete('/all/:user_id',function (req, res) {
        User.remove({_id: req.params.user_id}, function (err, user) {
            if (err)
                res.send(err);
    res.send({
                status: "success",
                message: 'User deleted'
            });
        });
    });

    router.patch('/all/add/:user_id/:todo_id',(req, res) =>{
        User.findByIdAndUpdate(req.params.user_id, { $push: {todos:req.params.todo_id}}, (err,post) =>{
            if (err)
            res.send(err);
            res.send({
                message: 'User Info updated',
                data: post
            });
        });
    });
    router.patch('/all/delete/:user_id/:todo_id',(req, res) =>{
        User.findByIdAndUpdate(req.params.user_id, { $pull: {todos:req.params.todo_id}}, (err,post) =>{
            if (err)
            res.send(err);
            res.send({
                message: 'User Info updated',
                data: post
            });
        });
    });

    router.get('/pop', function (req, res) {
        User.find().populate('todos').exec((err, user) => {
            res.send(user)})
    });

module.exports = router;