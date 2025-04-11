const PenaltyService = require("../../services/PenaltyService");


class PenaltyController {
    addPenalty = (req, res) => {
        let { Amount, Reason, UserId, BorrowRecordId } = req.body;
        PenaltyService.addPenalty(Amount, Reason, "PENDING", UserId, BorrowRecordId)
            .then(penalty => res.status(200).json(penalty))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    updateStatus = (req, res) => {
        let {id} = req.params;
        let {Status} = req.body;
        PenaltyService.updateStatus(id, Status)
            .then(result => res.status(200).json(result))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    getAll = (req, res) => {
        PenaltyService.getAll()
            .then(penalties => res.status(200).json(penalties))
            .catch(error => res.status(error.code).json({error : error.error}));
    }
}

module.exports = new PenaltyController();