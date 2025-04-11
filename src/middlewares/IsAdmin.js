// const jwt = require('jsonwebtoken');
// const secretKey = process.env.JWT_SECRET;
// const { User, Role } = require('../models');

// const IsAdmin = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

//     if (!token) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//         const {UserId} = jwt.verify(token, secretKey);

//         if (!UserId|| isNaN(UserId)) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         let user = await User.findByPk(UserId, {
//             include: {
//                 model: Role, 
//                 attributes: ['RoleId', 'RoleName'] 
//             }
//         });

//         if(user.Role.RoleName.toUpperCase().indexOf("ADMIN") === -1){
//             return res.status(403).json({ error: 'Forbidden' });
//         }

//         req.user = user;
//         next(); 
//     } catch (error) {
//         return res.status(401).json({ error: 'Expired Token' });
//     }
// };

// module.exports = IsAdmin;
// IsAdmin.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const { User, Role } = require('../models');

const IsAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        if (!decoded || !decoded.UserId || isNaN(decoded.UserId)) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
        }

        const UserId = decoded.UserId;  // Extract UserId from decoded token

        const user = await User.findByPk(UserId, {
            include: {
                model: Role,
                attributes: ['RoleId', 'RoleName']
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });  // Explicitly handle user not found
        }

        if (!user.Role || user.Role.RoleName.toUpperCase().indexOf("ADMIN") === -1) {
            return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
        }

        req.user = user; // Attach the user object to the request
        next();
    } catch (error) {
        console.error("Error verifying token:", error); // Log the error for debugging
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token signature' });
        } else {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' }); // Generic error for other JWT errors
        }
    }
};

const IsUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
  
      if (!decoded || !decoded.UserId || isNaN(decoded.UserId)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
      }
  
      const UserId = decoded.UserId; // Extract UserId from decoded token
  
      const user = await User.findByPk(UserId, {
        include: {
          model: Role,
          attributes: ['RoleId', 'RoleName'],
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' }); // Explicitly handle user not found
      }
  
      if (!user.Role || user.Role.RoleName.toUpperCase().indexOf('USER') === -1) {
        return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
      }
  
      req.user = user; // Attach the user object to the request
      next();
    } catch (error) {
      console.error('Error verifying token:', error); // Log the error for debugging
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token signature' });
      } else {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' }); // Generic error for other JWT errors
      }
    }
  };
module.exports = IsAdmin, IsUser;