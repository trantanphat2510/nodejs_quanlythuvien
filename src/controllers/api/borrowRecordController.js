// BorrowRecordController.js
const BookService = require('../../services/BookService');
const BorrowRecordService = require("../../services/BorrowRecordService");
const { User } = require('../../models');
const UserService = require('../../services/UserService');

class BorrowRecordController {

    addRecord = (req, res) => {
        let { BorrowDate, ReturnDate, Status, Arr, CardNumber } = req.body;
        UserService.getUserByCardNumber(CardNumber)
            .then(user => {
                BorrowRecordService.addRecord(BorrowDate, ReturnDate, Status, user.UserId, Arr)
                    .then(record => res.status(200).json(record))
                    .catch(error => res.status(error.code).json({ error: error.error }));
            })
            .catch(error => res.status(error.code).json({ error: error.error }));
    }

    deleteRecord = (req, res) => {
        let { id } = req.params;
        BorrowRecordService.deleteRecord(id)
            .then(record => res.status(200).json(record.message))
            .catch(error => res.status(error.code).json({ error: error.error }));
    }

    getRecordById = (req, res) => {
        let { id } = req.params;
        BorrowRecordService.getRecordById(id)
            .then(record => res.status(200).json(record))
            .catch(error => res.status(error.code).json({ error: error.error }));
    }

    getAll = (req, res) => {
        BorrowRecordService.getAll()
            .then(records => res.status(200).json(records))
            .catch(error => res.status(error.code).json({ error: error.error }))
    }

    updateStatus = (req, res) => {
        let { id } = req.params;
        let { Status } = req.body;
        BorrowRecordService.updateStatus(id, Status)
            .then(records => res.status(200).json(records))
            .catch(error => res.status(error.code).json({ error: error.error }))
    }

    getRecordsByStatus = (req, res) => {
        const { status } = req.params;

        BorrowRecordService.getRecordsByStatus(status)
            .then(records => res.status(200).json(records))
            .catch(error => res.status(error.code || 500).json({ error: error.error }));
    }

}

module.exports = new BorrowRecordController();