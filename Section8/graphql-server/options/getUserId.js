const jwt = require('jsonwebtoken');

const getUserId = (request, requireAuth = true) => {
    // JWTトークンの値
    // console.log(request.req.headers.authorization);
     const header = request.req.headers.authorization;
    if (header) {
        const token = header.replace('Bearer ', '');
        //第二引数はenvに変える
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)//ユーザーID
        return decoded;
    }

    if (requireAuth) {
        throw new Error('Authentication required');
    }

    return null;
}

module.exports = getUserId;