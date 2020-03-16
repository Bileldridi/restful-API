let router = require('express').Router();
var ToDo = require('./../models/todoSchema');

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

module.exports = router;