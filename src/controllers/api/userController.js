

class UserController{

    getCurrentUser = (req, res) => {
        res.status(200).json(req.user);
    }
    
}

module.exports = new UserController();