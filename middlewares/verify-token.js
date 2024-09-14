const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    let token = req.headers["authorization"];
    let checkBearer = "Bearer "

    if(token){
        console.log(token)
        if(token.startsWith(checkBearer)){
            token = token.slice(checkBearer.length, token.length)
        }
        jwt.verify(token,process.env.SECRET_TOKEN_KEY,(err,decoded)=>{
            if(err){
                res.json({
                    success: false,
                    message: "Failed to authenticate"
                });
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        res.json({
            success: false,
            message:'no token provided'
        })
    }
}