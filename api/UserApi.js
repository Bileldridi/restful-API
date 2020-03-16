let router = require('express').Router();
var User = require('./../models/userSchema');
var multer  = require('multer');
var path = require('path')
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

    router.post('/upload/:user_id', upload.single('file'), (req, res)=>{
        console.log(req.file);
        if(!req.file){
            res.send(err);
        }
        User.findByIdAndUpdate(req.params.user_id, req.body,{ $set: {file:req.file.filename}}, function (err, post) {
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