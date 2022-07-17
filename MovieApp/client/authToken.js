import jwt from 'jsonwebtoken'
const authToken = (req, res, next) => {
    try {
        let header = req.headers['authorization'];
        console.log(typeof header !== 'undefined');
        if (typeof header !== 'undefined') {
            let bearer = header.split(':');
            console.log(bearer[1]);
            const {username}  = jwt.verify(bearer[1], 'This-is-my-secret-code#1');
            req.username = username;
            req.isExpired = false;
            next();
        }
    } catch (error) {
        req.isExpired = true;
        next();
    }
}

// generate token
const generateAccessToken = (username) => jwt.sign({username: username},'This-is-my-secret-code#1', {expiresIn: '24h' } )

export {
    authToken,
    generateAccessToken
}