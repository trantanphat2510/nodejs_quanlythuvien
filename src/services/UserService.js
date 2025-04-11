const { User } = require('../models');

class UserService {
    
    getUserById = async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || isNaN(id)) {
                    return reject({ code: 400, error: "ID không hợp lệ" });
                }
                
                const user = await User.findByPk(id);
                if (!user) {
                    return reject({ code: 404, error: "Người dùng không tồn tại" });
                }

                return resolve(user);

            } catch (error) {
                reject({ code: 500, error: "Internal Server Error", details: error.message });
            }
        });
    }

    getUserByCardNumber = async (CardNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!CardNumber || typeof CardNumber !== "string" || CardNumber.trim() === "") {
                    return reject({ code: 400, error: "Số thẻ không hợp lệ" });
                }
    
                const user = await User.findOne({
                    where: { CardNumber: CardNumber.trim() }
                });
    
                if (!user) {
                    return reject({ code: 404, error: "Người dùng không tồn tại với số thẻ này" });
                }
    
                return resolve(user);
    
            } catch (error) {
                reject({ code: 500, error: "Internal Server Error", details: error.message });
            }
        });
    }    

}

module.exports = new UserService();