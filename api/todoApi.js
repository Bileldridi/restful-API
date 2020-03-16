let router = require('express').Router();
var ToDo = require('./../models/todoSchema');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './images');
    }, filename: (req, file, cb)=> {
        console.log(file);
        var filetype='';
        if(file.mimetypetype === 'image/gif'){
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

router.get('/', function (req, res) {
    ToDo.find(function (err, todo) {
        if (err) {
            res.send({
                status: "error",
                message: err,
            });
        }
        res.send({
            message: "Todo retrieved successfully",
            data: todo
        });
    });
});

router.post('/', function (req, res) {
    var todo = new ToDo();
    todo.title = req.body.title;
    todo.desc = req.body.desc;
    todo.file = req.file.path;
    todo.save(function (err) {
         if (err)
             res.send(err);
res.send({
            message: 'New todo created!',
            data: todo
        });
    });
});

router.get('/:todo_id', function (req, res) {
    ToDo.findById(req.params.todo_id, function (err, todo) {
        if (err)
            res.send(err);
        res.send({
            message: 'Todo details loading..',
            data: todo
        });
    });
});

router.patch('/:todo_id', function (req, res) {
    ToDo.findById(req.params.todo_id, function (err, todo) {
            if (err)
                res.send(err);
            todo.title = req.body.title;
            todo.desc = req.body.desc;
            todo.save(function (err) {
                if (err)
                    res.send(err);
                res.send({
                    message: 'todo Info updated',
                    data: todo
                });
            });
        });
    });
    router.delete('/:todo_id',function (req, res) {
        ToDo.remove({_id: req.params.todo_id}, function (err, todo) {
            if (err)
                res.send(err);
    res.send({
                status: "success",
                message: 'Todo deleted'
            });
        });
    });

    router.post('/upload', upload.single('file'), (req, res)=>{
        console.log(req.file);
        if(!req.file){
            res.status(500);
        }
        res.send({
            message: 'upload file success'
        })

    })

module.exports = router;