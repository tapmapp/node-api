const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if(err) {

            // RETURN ERROR
            return res.status(500).json({
                reponse: err,
                result: {
                    err: err,
                    message: 'TokenExpiredError', 
                    token: token,
                }
            });

        } else {

            req.userData = decoded;
            next();

        }   

    });

};