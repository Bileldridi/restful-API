var jwt = require('jsonwebtoken');
var BearerStrategy = require('passport-http-bearer');
var passport = require('passport');
var User = require('./models/userSchema');

passport.use(new BearerStrategy(
    function(token, cb) {
        jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
            if (err) return cb(err);
            User.findOne({ _id: decoded.userId }, function (err, user) {
                if (err) { return cb(err); }
                if (!user) { return cb(null, false); }
                return cb(null, user, { scope: 'all' });
              });
          });
        }));
       

        // module.exports = (req, res, next) =>{
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         console.log(token);
        
//         const decoded = jwt.verify(token, process.env.JWT_KEY);
//         req.userData = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             message: 'Auth failed'
//         });
//     } 
// };