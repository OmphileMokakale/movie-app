import jwt from 'jsonwebtoken'
const authToken = (req, res, next) => {
    try {
        let header = req.headers['authorization'];
        if (typeof header !== 'undefined') {
            let bearer = header.split(':');
            const {username}  = jwt.verify(bearer[1], 'This-is-my-secret-code#1');
            req.username = username;
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

// generate token
const generateAccessToken = (username) => jwt.sign({username: username},'This-is-my-secret-code#1', {expiresIn: '24h' } )

export {
    authToken,
    generateAccessToken
}