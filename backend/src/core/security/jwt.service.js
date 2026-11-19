import jwt from "jsonwebtoken"

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            status: user.status

        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3h"
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET,)
}

export {
    generateToken,
    verifyToken
}