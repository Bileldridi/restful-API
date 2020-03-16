let express = require('express');
let app = express();
var db = require('./db/database')
let bodyParser = require('body-parser');
let userApi = require("./api/UserApi")
let apiRoutes = require("./api/todoApi")
const nodemailer = require('nodemailer')
app.use(bodyParser.urlencoded({
    extended: true
 }));
 app.use(bodyParser.json());
var port = process.env.PORT || 8080;
app.use('/todos', apiRoutes)
app.use('/users', userApi)
var transport = nodemailer.createTransport({
    service : 'Gmail',
    auth: {
        user:'drd.bilel@gmail.com',
        pass:'Guts231290'
        }
});
app.post('/sendmail', (req,res) =>{
    var msg = {
        html: "<p>Hello!</p><p>Mail sent working</p>",
        createTextFromHtml: true,
        from:"<drd.bilel@gmail.com>",
        to:"<d.ghofrane_97@live.fr>",
        subject:"Nodemail"
    };
    transport.sendMail(msg, (err)=>{
        if(err)
        res.send(err);
        res.send({
            messeage: 'mail send success!'
        });
    });
});
app.get('/', (req, res) => res.send('Hello World with Express'));
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});