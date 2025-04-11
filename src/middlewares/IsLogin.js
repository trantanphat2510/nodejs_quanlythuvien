const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const { User, Role } = require('../models');

const AuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const {UserId} = jwt.verify(token, secretKey);

        if (!UserId|| isNaN(UserId)) {
            return reject({ code: 401, error: "Unauthorized" });
        }

        let user = await User.findByPk(UserId, {
            include: {
                model: Role, 
                attributes: ['RoleId', 'RoleName'] 
            }
        });

        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).json({ error: 'Expired Token' });
    }
};

module.exports = AuthMiddleware;