const { Penalty, User, BorrowRecord } = require('../models'); 

class PenaltyService {
    addPenalty = (Amount, Reason, Status = 'PENDING', UserId, BorrowRecordId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const penalty = await Penalty.create({
                    Amount,
                    Reason,
                    Status,
                    UserUserId: UserId,
                    BorrowRecordRecordId: BorrowRecordId
                });
                resolve(penalty);
            } catch (error) {
                console.log(error);
                reject({ code: 500, error: 'Lỗi server', details: error.message });
            }
        });
    };

    getAll = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const penalties = await Penalty.findAll({
                    include: [
                        { model: User, attributes: ['UserId', 'Username', 'Email'] },
                        { model: BorrowRecord }
                    ],
                    order: [['PenaltyId', 'DESC']]
                });
                resolve(penalties);
            } catch (error) {
                console.log(error);
                reject({ code: 500, error: 'Lỗi server', details: error.message });
            }
        });
    }

    updateStatus = (PenaltyId, Status) => {
        return new Promise(async (resolve, reject) => {
            try {
                const updated = await Penalty.update(
                    { Status },
                    { where: { PenaltyId } }
                );

                if (updated[0] === 0) {
                    reject(new Error("Penalty not found or status unchanged."));
                } else {
                    resolve({ message: "Status updated successfully." });
                }
            } catch (error) {
                console.log(error);
                reject({ code: 500, error: 'Lỗi server', details: error.message });
            }
        });
    };
}

module.exports = new PenaltyService();
