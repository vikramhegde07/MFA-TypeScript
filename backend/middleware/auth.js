import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token)
        return res.status(401).json("Access Denied. No token provided.");
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData.id;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json("Server Error: " + err);
    }
}

export const createToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
    }
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: '72h'
        }
    );
    return token;
}