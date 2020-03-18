let router = require('express').Router();
var User = require('./../models/userSchema');
var multer  = require('multer');
var path = require('path')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const passport = require('../passport');


const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './images');
    }, filename: (req, file, cb)=> {
        var filetype='';
        if(file.mimetype === 'image/gif'){
            filetype='gif';
        }
        if( file.mimetype === 'image/png'){
            filetype='png';
        }
        if( file.mimetype === 'image/jpeg'){
            filetype='jpeg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({storage: storage});


router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });

                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash

                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);

                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err);

                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post('/login',(req, res, next)=> {
    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result)=> {
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})

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

    router.post('/upload/:user_id', passport, upload.single('file'), (req, res)=>{
        console.log(req.file);
        if(!req.file){
            res.send(err);
        }
        User.findByIdAndUpdate(req.params.user_id, { $set: {file:req.file.filename}}, function (err, post) {
            if (err)
                res.send(err);
                res.send({
                    message: 'User Pic success!',
                    data: post
                });
            });

    });
router.get('/upload/:filename', function (req, res) {        
       const filepath = path.join(__dirname, "../images", req.params.filename);
        res.sendFile(filepath);
});


module.exports = router;